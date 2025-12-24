package com.jan.api.admin;

import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;

import java.util.Map;

public class ApiResponse {

    public static APIGatewayProxyResponseEvent ok(String body) {
        return response(200, body);
    }

    public static APIGatewayProxyResponseEvent forbidden(String body) {
        return response(403, body);
    }

    public static APIGatewayProxyResponseEvent response(int statusCode, String body) {
        return new APIGatewayProxyResponseEvent()
                .withStatusCode(statusCode)
                .withHeaders(corsHeaders())
                .withBody(body);
    }

    private static Map<String, String> corsHeaders() {
        return Map.of(
                "Access-Control-Allow-Origin", System.getenv("FRONTEND_ORIGIN"),
                "Access-Control-Allow-Headers", "Content-Type,Authorization",
                "Access-Control-Allow-Methods", "OPTIONS,GET,POST,PUT"
        );
    }
}
