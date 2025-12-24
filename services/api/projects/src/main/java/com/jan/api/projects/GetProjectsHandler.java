package com.jan.api.projects;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.ScanRequest;

public class GetProjectsHandler
        implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    private static final ObjectMapper mapper = new ObjectMapper();
    private static final DynamoDbClient dynamo = DynamoDbClient.create();

    private static final String TABLE_NAME = System.getenv("TABLE_NAME");
    private static final String FRONTEND_ORIGIN = System.getenv("FRONTEND_ORIGIN");

    @Override
    public APIGatewayProxyResponseEvent handleRequest(
            APIGatewayProxyRequestEvent event, Context context) {
        try {
            Map<String, String> names = Map.of("#type", "type");
            Map<String, AttributeValue> values = Map.of(":type", AttributeValue.fromS("PROJECT"));

            ScanRequest request =
                    ScanRequest.builder()
                            .tableName(TABLE_NAME)
                            .filterExpression("#type = :type")
                            .expressionAttributeNames(names)
                            .expressionAttributeValues(values)
                            .build();

            List<Map<String, AttributeValue>> items = dynamo.scan(request).items();
            List<Project> projects = new ArrayList<>();

            for (Map<String, AttributeValue> item : items) {
                projects.add(mapProject(item));
            }

            return response(200, mapper.writeValueAsString(projects));
        } catch (Exception e) {
            context.getLogger().log("Failed to fetch projects: " + e.getMessage());
            return response(500, "{\"error\":\"Failed to fetch projects\"}");
        }
    }

    private Project mapProject(Map<String, AttributeValue> item) {
        Project project = new Project();
        project.id = getString(item, "id");
        project.name = getString(item, "name");
        project.description = getString(item, "description");
        project.organization = getString(item, "organization");
        project.region = getString(item, "region");
        project.lifecycle = getString(item, "lifecycle");
        project.createdYear = getNumber(item, "createdYear");
        project.technologies = getStringList(item, "technologies");
        return project;
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

    private APIGatewayProxyResponseEvent response(int status, String body) {
        return new APIGatewayProxyResponseEvent()
                .withStatusCode(status)
                .withHeaders(corsHeaders())
                .withBody(body);
    }

    private Map<String, String> corsHeaders() {
        String origin = FRONTEND_ORIGIN != null ? FRONTEND_ORIGIN : "*";
        return Map.of(
                "Content-Type", "application/json",
                "Access-Control-Allow-Origin", origin,
                "Access-Control-Allow-Headers", "Content-Type,Authorization",
                "Access-Control-Allow-Methods", "OPTIONS,GET");
    }

    static class Project {
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
