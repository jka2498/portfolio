package com.jan.experiences;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.ScanRequest;
import software.amazon.awssdk.services.dynamodb.model.ScanResponse;

public class GetExperiencesHandler
    implements RequestHandler<APIGatewayV2HTTPEvent, APIGatewayV2HTTPResponse> {

  private static final DynamoDbClient dynamo =
      DynamoDbClient.builder().region(Region.of(System.getenv("AWS_REGION"))).build();

  private static final String TABLE_NAME = System.getenv("TABLE_NAME");

  @Override
  public APIGatewayV2HTTPResponse handleRequest(APIGatewayV2HTTPEvent event, Context context) {

    if (TABLE_NAME == null || TABLE_NAME.isBlank()) {
      return APIGatewayV2HTTPResponse.builder()
          .withStatusCode(500)
          .withHeaders(Map.of("Content-Type", "application/json"))
          .withBody("{\"error\":\"TABLE_NAME env var not set\"}")
          .build();
    }

    ScanResponse response = dynamo.scan(ScanRequest.builder().tableName(TABLE_NAME).build());

    List<Map<String, Object>> items =
        response.items().stream()
            .map(
                item -> {
                  Map<String, Object> m = new HashMap<>();
                  m.put("id", item.get("id").s());
                  m.put("role", item.get("role").s());
                  m.put("company", item.get("company").s());
                  m.put("state", item.get("state").s());
                  if (item.containsKey("startYear")) {
                    m.put("startYear", Integer.parseInt(item.get("startYear").n()));
                  }
                  return m;
                })
            .toList();

    return APIGatewayV2HTTPResponse.builder()
        .withStatusCode(200)
        .withHeaders(Map.of("Content-Type", "application/json"))
        .withBody(JsonUtil.toJson(items))
        .build();
  }
}
