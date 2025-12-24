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
import java.util.Map;

public class CreateExperienceHandler
        implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

  private static final ObjectMapper mapper = new ObjectMapper();
  private static final DynamoDbClient dynamo = DynamoDbClient.create();

  private static final String TABLE_NAME = System.getenv("TABLE_NAME");
  private static final String FRONTEND_ORIGIN = System.getenv("FRONTEND_ORIGIN");

  @Override
  public APIGatewayProxyResponseEvent handleRequest(
      APIGatewayProxyRequestEvent event, Context context) {

    try {
      // ------------------------------------------------------------
      // Validate request body
      // ------------------------------------------------------------
      if (event.getBody() == null || event.getBody().isBlank()) {
        return error(400, "Missing request body");
      }

      ExperienceRequest req;
      try {
        req = mapper.readValue(event.getBody(), ExperienceRequest.class);
      } catch (Exception e) {
        return error(400, "Invalid JSON payload");
      }

      if (req.id == null
          || req.name == null
          || req.organization == null
          || req.state == null
          || req.launchYear == null) {
        return error(400, "Missing required fields");
      }

      // ------------------------------------------------------------
      // Write to DynamoDB (idempotent)
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

      dynamo.putItem(PutItemRequest.builder().tableName(TABLE_NAME).item(item).build());

      // ------------------------------------------------------------
      // Success
      // ------------------------------------------------------------
      return success(200, "{\"status\":\"stored\"}");

    } catch (Exception e) {
      context.getLogger().log("Unhandled error: " + e.getMessage());
      return error(500, "Internal server error");
    }
  }

  // ------------------------------------------------------------
  // Response helpers (CRITICAL for CORS)
  // ------------------------------------------------------------

  private APIGatewayProxyResponseEvent success(int status, String body) {
    return new APIGatewayProxyResponseEvent()
        .withStatusCode(status)
        .withHeaders(corsHeaders())
        .withBody(body);
  }

  private APIGatewayProxyResponseEvent error(int status, String message) {
    return new APIGatewayProxyResponseEvent()
        .withStatusCode(status)
        .withHeaders(corsHeaders())
        .withBody("{\"error\":\"" + message + "\"}");
  }

  private Map<String, String> corsHeaders() {
    return Map.of(
        "Content-Type", "application/json",
        "Access-Control-Allow-Origin", FRONTEND_ORIGIN,
        "Access-Control-Allow-Headers", "Content-Type,Authorization",
        "Access-Control-Allow-Methods", "OPTIONS,POST,PUT");
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
