package com.jan.experiences;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPResponse;

import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.ScanRequest;
import software.amazon.awssdk.services.dynamodb.model.ScanResponse;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GetExperiencesHandler
        implements RequestHandler<APIGatewayV2HTTPEvent, APIGatewayV2HTTPResponse> {

  private static final DynamoDbClient dynamo = DynamoDbClient.builder()
          .region(Region.of(System.getenv("AWS_REGION")))
          .build();

  private static final String TABLE_NAME = System.getenv("TABLE_NAME");

  @Override
  public APIGatewayV2HTTPResponse handleRequest(
          APIGatewayV2HTTPEvent event,
          Context context
  ) {
    context.getLogger().log("GetExperiences handler invoked\n");

    if (TABLE_NAME == null || TABLE_NAME.isBlank()) {
      return error(500, "TABLE_NAME environment variable not set");
    }

    // ------------------------------------------------------------
    // Query parameters
    // ------------------------------------------------------------
    Map<String, String> queryParams =
            event.getQueryStringParameters() != null
                    ? event.getQueryStringParameters()
                    : Map.of();

    String stateFilter = queryParams.get("state");
    String sortBy = queryParams.get("sort");

    // ------------------------------------------------------------
    // DynamoDB scan
    // ------------------------------------------------------------
    ScanResponse response = dynamo.scan(
            ScanRequest.builder()
                    .tableName(TABLE_NAME)
                    .build()
    );

    // ------------------------------------------------------------
    // Map DynamoDB items → domain objects
    // ------------------------------------------------------------
    List<Map<String, Object>> items =
            response.items().stream()
                    .map(GetExperiencesHandler::toExperience)
                    .toList();

    // ------------------------------------------------------------
    // Filtering (state)
    // ------------------------------------------------------------
    if (stateFilter != null && !stateFilter.isBlank()) {
      items = items.stream()
              .filter(exp -> stateFilter.equals(exp.get("state")))
              .toList();
    }

    // ------------------------------------------------------------
    // Sorting (startYear, descending)
    // ------------------------------------------------------------
    if ("startYear".equals(sortBy)) {
      items = items.stream()
              .sorted((a, b) -> {
                Integer ay = (Integer) a.get("startYear");
                Integer by = (Integer) b.get("startYear");

                if (ay == null && by == null) return 0;
                if (ay == null) return 1;
                if (by == null) return -1;
                return by.compareTo(ay); // newest first
              })
              .toList();
    }

    // ------------------------------------------------------------
    // Response
    // ------------------------------------------------------------
    return APIGatewayV2HTTPResponse.builder()
            .withStatusCode(200)
            .withHeaders(Map.of(
                    "Content-Type", "application/json"
            ))
            .withBody(JsonUtil.toJson(items))
            .build();
  }

  // ============================================================
  // Helpers
  // ============================================================

  private static Map<String, Object> toExperience(
          Map<String, AttributeValue> item
  ) {
    Map<String, Object> m = new HashMap<>();
    putStringIfPresent(m, "id", item.get("id"));
    putStringIfPresent(m, "role", item.get("role"));
    putStringIfPresent(m, "company", item.get("company"));
    putStringIfPresent(m, "state", item.get("state"));
    putNumberIfPresent(m, "startYear", item.get("startYear"));
    return m;
  }

  private static void putStringIfPresent(
          Map<String, Object> target,
          String key,
          AttributeValue value
  ) {
    if (value != null && value.s() != null) {
      target.put(key, value.s());
    }
  }

  private static void putNumberIfPresent(
          Map<String, Object> target,
          String key,
          AttributeValue value
  ) {
    if (value != null && value.n() != null && !value.n().isBlank()) {
      try {
        target.put(key, Integer.parseInt(value.n()));
      } catch (NumberFormatException ex) {
        target.put(key, value.n());
      }
    }
  }

  private static APIGatewayV2HTTPResponse error(int status, String message) {
    return APIGatewayV2HTTPResponse.builder()
            .withStatusCode(status)
            .withHeaders(Map.of(
                    "Content-Type", "application/json"
            ))
            .withBody("{\"error\":\"" + message + "\"}")
            .build();
  }
}
