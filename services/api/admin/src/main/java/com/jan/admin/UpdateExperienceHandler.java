package com.jan.admin;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.Map;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.UpdateItemRequest;

public class UpdateExperienceHandler
        implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    private static final DynamoDbClient dynamo = DynamoDbClient.create();
    private static final ObjectMapper mapper = new ObjectMapper();

    private static final String TABLE_NAME = System.getenv("TABLE_NAME");

    @Override
    public APIGatewayProxyResponseEvent handleRequest(
            APIGatewayProxyRequestEvent event,
            Context context) {

        String id = event.getPathParameters().get("id");

        try {
            Map<String, Object> body =
                    mapper.readValue(event.getBody(), Map.class);

            Map<String, String> names = new HashMap<>();
            Map<String, AttributeValue> values = new HashMap<>();

            String updateExpr =
                    buildUpdateExpression(body, names, values);

            dynamo.updateItem(UpdateItemRequest.builder()
                    .tableName(TABLE_NAME)
                    .key(Map.of(
                            "id", AttributeValue.fromS(id)
                    ))
                    .updateExpression(updateExpr)
                    .expressionAttributeNames(names)
                    .expressionAttributeValues(values)
                    .build());

            return response(200, "Updated");

        } catch (Exception e) {
            return response(500, e.getMessage());
        }
    }

    private String buildUpdateExpression(
            Map<String, Object> body,
            Map<String, String> names,
            Map<String, AttributeValue> values) {

        StringBuilder expr = new StringBuilder("SET ");
        boolean first = true;

        for (Map.Entry<String, Object> entry : body.entrySet()) {
            if (!first) expr.append(", ");
            first = false;

            String key = entry.getKey();
            names.put("#" + key, key);

            Object v = entry.getValue();
            if (v instanceof Number) {
                values.put(":" + key, AttributeValue.fromN(v.toString()));
            } else {
                values.put(":" + key, AttributeValue.fromS(v.toString()));
            }

            expr.append("#").append(key).append(" = :").append(key);
        }

        return expr.toString();
    }

    private APIGatewayProxyResponseEvent response(int status, String body) {
        return new APIGatewayProxyResponseEvent()
                .withStatusCode(status)
                .withBody("{\"message\":\"" + body + "\"}");
    }
}
