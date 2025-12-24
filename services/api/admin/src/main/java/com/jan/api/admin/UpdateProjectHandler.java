package com.jan.api.admin;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class UpdateProjectHandler
        implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

  private static final ObjectMapper mapper = new ObjectMapper();
  private static final DynamoDbClient dynamo = DynamoDbClient.create();

  private static final String TABLE_NAME = System.getenv("TABLE_NAME");

  @Override
  public APIGatewayProxyResponseEvent handleRequest(
          APIGatewayProxyRequestEvent event, Context context) {
    try {
      String id = event.getPathParameters() != null ? event.getPathParameters().get("id") : null;
      if (id == null || id.isBlank()) {
        return ApiResponse.response(400, "{\"error\":\"Missing project id\"}");
      }

      if (event.getBody() == null || event.getBody().isBlank()) {
        return ApiResponse.response(400, "{\"error\":\"Missing request body\"}");
      }

      ProjectRequest req;
      try {
        req = mapper.readValue(event.getBody(), ProjectRequest.class);
      } catch (Exception e) {
        return ApiResponse.response(400, "{\"error\":\"Invalid JSON payload\"}");
      }

      if (req.id != null && !id.equals(req.id)) {
        return ApiResponse.response(400, "{\"error\":\"Project id mismatch\"}");
      }

      if (req.name == null || req.lifecycle == null) {
        return ApiResponse.response(400, "{\"error\":\"Missing required fields\"}");
      }

      Map<String, AttributeValue> item = buildItem(req, id);
      dynamo.putItem(PutItemRequest.builder().tableName(TABLE_NAME).item(item).build());

      return ApiResponse.ok("{\"status\":\"updated\"}");
    } catch (Exception e) {
      context.getLogger().log("Unhandled error: " + e.getMessage());
      return ApiResponse.response(500, "{\"error\":\"Internal server error\"}");
    }
  }

  private Map<String, AttributeValue> buildItem(ProjectRequest req, String id) {
    Map<String, AttributeValue> item = new HashMap<>();
    item.put("id", AttributeValue.fromS(id));
    item.put("type", AttributeValue.fromS("PROJECT"));
    item.put("name", AttributeValue.fromS(req.name));
    item.put("lifecycle", AttributeValue.fromS(req.lifecycle));

    if (req.description != null) {
      item.put("description", AttributeValue.fromS(req.description));
    }
    if (req.organization != null) {
      item.put("organization", AttributeValue.fromS(req.organization));
    }
    if (req.region != null) {
      item.put("region", AttributeValue.fromS(req.region));
    }
    if (req.createdYear != null) {
      item.put("createdYear", AttributeValue.fromN(req.createdYear.toString()));
    }
    if (req.technologies != null && !req.technologies.isEmpty()) {
      List<AttributeValue> techValues =
              req.technologies.stream().map(AttributeValue::fromS).toList();
      item.put("technologies", AttributeValue.fromL(techValues));
    }

    return item;
  }

  static class ProjectRequest {
    public String id;
    public String name;
    public String description;
    public String organization;
    public String region;
    public String lifecycle;
    public Integer createdYear;
    public List<String> technologies;
  }
}
