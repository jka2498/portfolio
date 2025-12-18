package com.jan.experiences;


import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import java.util.Map;

public class GetExperiencesHandler
        implements RequestHandler<Map<String, Object>, Map<String, Object>> {

    @Override
    public Map<String, Object> handleRequest(
            Map<String, Object> event,
            Context context
    ) {
        return Map.of(
                "statusCode", 200,
                "body", """
                [
                  {
                    "id": "exp-1",
                    "role": "Software Engineer",
                    "company": "Example Corp",
                    "state": "RUNNING"
                  }
                ]
                """
        );
    }
}
