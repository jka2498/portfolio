package com.jan.admin;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;

import java.util.HashMap;
import java.util.Map;

public class CreateExperienceHandler
        implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

  private static final ObjectMapper mapper = new ObjectMapper();
  private static final DynamoDbClient dynamo = DynamoDbClient.create();

  private static final String TABLE_NAME = System.getenv("TABLE_NAME");
  private static final String ADMIN_KEY = System.getenv("ADMIN_KEY");

  @Override
  public APIGatewayProxyResponseEvent handleRequest(
          APIGatewayProxyRequestEvent event, Context context) {

    // ------------------------------------------------------------
    // 1. Admin key check
    // ------------------------------------------------------------
    String providedKey = event.getHeaders() != null
            ? event.getHeaders().get("x-admin-key")
            : null;

    if (ADMIN_KEY == null || !ADMIN_KEY.equals(providedKey)) {
      return response(403, "Forbidden");
    }

    // ------------------------------------------------------------
    // 2. Parse request body
    // ------------------------------------------------------------
    if (event.getBody() == null || event.getBody().isBlank()) {
      return response(400, "Missing request body");
    }

    ExperienceRequest req;
    try {
      req = mapper.readValue(event.getBody(), ExperienceRequest.class);
    } catch (Exception e) {
      return response(400, "Invalid JSON payload");
    }

    // ------------------------------------------------------------
    // 3. Validate required fields
    // ------------------------------------------------------------
    if (req.id == null || req.name == null || req.organization == null
            || req.state == null || req.launchYear == null) {
      return response(400, "Missing required fields");
    }

    // ------------------------------------------------------------
    // 4. Write to DynamoDB (idempotent)
    // ------------------------------------------------------------
    Map<String, AttributeValue> item = new HashMap<>();
    item.put("id", AttributeValue.fromS(req.id));
    item.put("name", AttributeValue.fromS(req.name));
    item.put("organization", AttributeValue.fromS(req.organization));
    item.put("state", AttributeValue.fromS(req.state));
    item.put("launchYear", AttributeValue.fromN(req.launchYear.toString()));

    if (req.domain != null) {
      item.put("domain", AttributeValue.fromS(req.domain));
    }
    if (req.description != null) {
      item.put("description", AttributeValue.fromS(req.description));
    }

    dynamo.putItem(
            PutItemRequest.builder()
                    .tableName(TABLE_NAME)
                    .item(item)
                    .build()
    );

    // ------------------------------------------------------------
    // 5. Return success
    // ------------------------------------------------------------
    return response(200, "Stored");
  }

  private APIGatewayProxyResponseEvent response(int status, String body) {
    return new APIGatewayProxyResponseEvent()
            .withStatusCode(status)
            .withHeaders(Map.of("Content-Type", "application/json"))
            .withBody("{\"message\":\"" + body + "\"}");
  }

  // ------------------------------------------------------------
  // Request DTO
  // ------------------------------------------------------------
  static class ExperienceRequest {
    public String id;
    public String name;
    public String organization;
    public String domain;
    public String state;
    public Integer launchYear;
    public String description;
  }
}
