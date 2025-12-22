package com.jan;

import java.util.List;
import java.util.Map;

import software.amazon.awscdk.Stack;
import software.amazon.awscdk.StackProps;
import software.amazon.awscdk.RemovalPolicy;

import software.amazon.awscdk.aws_apigatewayv2_integrations.HttpLambdaIntegration;
import software.amazon.awscdk.services.apigatewayv2.HttpApi;
import software.amazon.awscdk.services.apigatewayv2.HttpMethod;
import software.amazon.awscdk.services.apigatewayv2.AddRoutesOptions;

import software.amazon.awscdk.services.dynamodb.Attribute;
import software.amazon.awscdk.services.dynamodb.AttributeType;
import software.amazon.awscdk.services.dynamodb.BillingMode;
import software.amazon.awscdk.services.dynamodb.Table;

import software.amazon.awscdk.services.lambda.Code;
import software.amazon.awscdk.services.lambda.Function;
import software.amazon.awscdk.services.lambda.Runtime;

import software.constructs.Construct;

public class ExperiencesStack extends Stack {

    public ExperiencesStack(final Construct scope, final String id) {
        this(scope, id, null);
    }

    public ExperiencesStack(final Construct scope, final String id, final StackProps props) {
        super(scope, id, props);

        // ------------------------------------------------------------
        // DynamoDB: PortfolioExperiences
        // ------------------------------------------------------------
        Table experiencesTable = Table.Builder.create(this, "ExperiencesTable")
                .tableName("PortfolioExperiences")
                .partitionKey(Attribute.builder()
                        .name("id")
                        .type(AttributeType.STRING)
                        .build())
                .billingMode(BillingMode.PAY_PER_REQUEST)
                .removalPolicy(RemovalPolicy.RETAIN)
                .build();

        // ------------------------------------------------------------
        // Lambda: GetExperiences (Java)
        // ------------------------------------------------------------
        Function getExperiencesFunction = Function.Builder.create(this, "GetExperiencesFunction")
                .functionName("GetExperiences")
                .runtime(Runtime.JAVA_21)
                .handler("com.jan.experiences.GetExperiencesHandler")
                .code(Code.fromAsset("../services/api/experiences/target/experiences.jar"))
                .environment(Map.of(
                        "TABLE_NAME", experiencesTable.getTableName()
                ))
                .build();

        experiencesTable.grantReadData(getExperiencesFunction);

        // ------------------------------------------------------------
        // API Gateway: HTTP API
        // ------------------------------------------------------------
        HttpApi api = HttpApi.Builder.create(this, "PortfolioApi")
                .apiName("PortfolioApi")
                .build();

        api.addRoutes(AddRoutesOptions.builder()
                .path("/experiences")
                .methods(List.of(HttpMethod.GET))
                .integration(new HttpLambdaIntegration(
                        "GetExperiencesIntegration",
                        getExperiencesFunction
                ))
                .build());
    }
}
