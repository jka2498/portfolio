package com.jan.api.experiences;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.ScanRequest;

public class GetExperiencesHandler
        implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    private static final ObjectMapper mapper = new ObjectMapper();
    private static final DynamoDbClient dynamo = DynamoDbClient.create();

    private static final String TABLE_NAME = System.getenv("TABLE_NAME");
    private static final String FRONTEND_ORIGIN = System.getenv("FRONTEND_ORIGIN");

    @Override
    public APIGatewayProxyResponseEvent handleRequest(
            APIGatewayProxyRequestEvent event, Context context) {

        try {
            ScanRequest request =
                    ScanRequest.builder()
                            .tableName(TABLE_NAME)
                            .build();

            List<Map<String, AttributeValue>> items = dynamo.scan(request).items();
            List<Experience> experiences = new ArrayList<>();
            for (Map<String, AttributeValue> item : items) {
                experiences.add(mapExperience(item));
            }

            return response(200, mapper.writeValueAsString(experiences));
        } catch (Exception e) {
            context.getLogger().log("Failed to fetch experiences: " + e.getMessage());
            return response(500, "{\"error\":\"Failed to fetch experiences\"}");
        }
    }

    private APIGatewayProxyResponseEvent response(int status, String body) {
        String origin = FRONTEND_ORIGIN != null ? FRONTEND_ORIGIN : "*";
        return new APIGatewayProxyResponseEvent()
                .withStatusCode(status)
                .withHeaders(
                        Map.of(
                                "Content-Type",
                                "application/json",
                                "Access-Control-Allow-Origin",
                                origin,
                                "Access-Control-Allow-Headers",
                                "Content-Type,Authorization",
                                "Access-Control-Allow-Methods",
                                "OPTIONS,GET"))
                .withBody(body);
    }

  private Experience mapExperience(Map<String, AttributeValue> item) {
    Experience experience = new Experience();
    experience.id = getString(item, "id");
    experience.role = getString(item, "role");
    experience.company = getString(item, "company");
    experience.state = getString(item, "state");
    experience.startYear = getNumber(item, "startYear");
    experience.endYear = getNumber(item, "endYear");
    experience.instanceType = getString(item, "instanceType");
    experience.technologies = getStringList(item, "technologies");
    experience.responsibilities = getStringList(item, "responsibilities");
    experience.az = getString(item, "az");
    return experience;
  }

    private String getString(Map<String, AttributeValue> item, String key) {
        AttributeValue value = item.get(key);
    return value != null ? value.s() : null;
  }

  private Integer getNumber(Map<String, AttributeValue> item, String key) {
    AttributeValue value = item.get(key);
    if (value == null || value.n() == null) {
      return null;
    }
    return Integer.valueOf(value.n());
  }

  private List<String> getStringList(Map<String, AttributeValue> item, String key) {
    AttributeValue value = item.get(key);
    if (value == null || value.l() == null) {
      return null;
    }
    List<String> results = new ArrayList<>();
    for (AttributeValue entry : value.l()) {
      if (entry.s() != null) {
        results.add(entry.s());
      }
    }
    return results;
  }

  static class Experience {
    public String id;
    public String role;
    public String company;
    public String state;
    public Integer startYear;
    public Integer endYear;
    public String instanceType;
    public List<String> technologies;
    public List<String> responsibilities;
    public String az;
  }
}
