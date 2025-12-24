package com.jan.api.experiences;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.time.Duration;
import java.util.Map;

public class GetCvDownloadUrlHandler
        implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    private static final String CV_BUCKET = System.getenv("CV_BUCKET");
    private static final String CV_OBJECT_KEY = System.getenv("CV_OBJECT_KEY");
    private static final String FRONTEND_ORIGIN = System.getenv("FRONTEND_ORIGIN");

    @Override
    public APIGatewayProxyResponseEvent handleRequest(
            APIGatewayProxyRequestEvent event, Context context) {
        if (CV_BUCKET == null || CV_OBJECT_KEY == null) {
            return response(500, "{\"error\":\"CV configuration missing\"}");
        }

        try (S3Presigner presigner = S3Presigner.create()) {
            GetObjectRequest getObjectRequest =
                    GetObjectRequest.builder().bucket(CV_BUCKET).key(CV_OBJECT_KEY).build();
            GetObjectPresignRequest presignRequest =
                    GetObjectPresignRequest.builder()
                            .signatureDuration(Duration.ofMinutes(10))
                            .getObjectRequest(getObjectRequest)
                            .build();

            String url = presigner.presignGetObject(presignRequest).url().toString();
            return response(200, "{\"url\":\"" + url + "\"}");
        } catch (Exception e) {
            context.getLogger().log("Failed to generate CV URL: " + e.getMessage());
            return response(500, "{\"error\":\"Failed to generate download URL\"}");
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
}
