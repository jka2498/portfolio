package com.jan.experiences;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.DynamoDbClientBuilder;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.ScanRequest;
import software.amazon.awssdk.services.dynamodb.model.ScanResponse;

public class GetExperiencesHandler
        implements RequestHandler<APIGatewayV2HTTPEvent, APIGatewayV2HTTPResponse> {

  private static final DynamoDbClient dynamo = buildDynamoClient();

  private static final String TABLE_NAME = System.getenv("TABLE_NAME");

  private static DynamoDbClient buildDynamoClient() {
    DynamoDbClientBuilder builder = DynamoDbClient.builder();
    String region = System.getenv("AWS_REGION");
    if (region != null && !region.isBlank()) {
      builder.region(software.amazon.awssdk.regions.Region.of(region));
    }
    return builder.build();
  }

  @Override
  public APIGatewayV2HTTPResponse handleRequest(APIGatewayV2HTTPEvent event, Context context) {
    context.getLogger().log("Handler started\n");

    if (TABLE_NAME == null || TABLE_NAME.isBlank()) {
      return APIGatewayV2HTTPResponse.builder()
              .withStatusCode(500)
              .withHeaders(Map.of("Content-Type", "application/json"))
              .withBody("{\"error\":\"TABLE_NAME env var not set\"}")
              .build();
    }

    context.getLogger().log("About to scan table: " + TABLE_NAME + "\n");

    ScanResponse response = dynamo.scan(ScanRequest.builder().tableName(TABLE_NAME).build());

    List<Map<String, Object>> items =
            response.items().stream()
                    .map(
                            item -> {
                              Map<String, Object> m = new HashMap<>();
                              putStringIfPresent(m, "id", item.get("id"));
                              putStringIfPresent(m, "role", item.get("role"));
                              putStringIfPresent(m, "company", item.get("company"));
                              putStringIfPresent(m, "state", item.get("state"));
                              putNumberIfPresent(m, "startYear", item.get("startYear"));
                              return m;
                            })
                    .toList();

    return APIGatewayV2HTTPResponse.builder()
            .withStatusCode(200)
            .withHeaders(Map.of("Content-Type", "application/json"))
            .withBody(JsonUtil.toJson(items))
            .build();
  }

  private static void putStringIfPresent(
          Map<String, Object> target, String key, AttributeValue value) {
    if (value != null && value.s() != null) {
      target.put(key, value.s());
    }
  }

  private static void putNumberIfPresent(
          Map<String, Object> target, String key, AttributeValue value) {
    if (value != null && value.n() != null && !value.n().isBlank()) {
      try {
        target.put(key, Integer.parseInt(value.n()));
      } catch (NumberFormatException ex) {
        target.put(key, value.n());
      }
    }
  }
}