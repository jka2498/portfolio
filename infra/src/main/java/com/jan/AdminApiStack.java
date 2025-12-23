package com.jan;

import java.util.Map;

import software.amazon.awscdk.Duration;
import software.amazon.awscdk.Stack;
import software.amazon.awscdk.StackProps;

import software.amazon.awscdk.services.apigateway.ApiDefinition;
import software.amazon.awscdk.services.apigateway.SpecRestApi;
import software.amazon.awscdk.services.apigateway.CfnStage;

import software.amazon.awscdk.services.dynamodb.ITable;

import software.amazon.awscdk.services.dynamodb.Table;
import software.amazon.awscdk.services.lambda.Function;
import software.amazon.awscdk.services.lambda.Runtime;
import software.amazon.awscdk.services.lambda.Code;
import software.amazon.awscdk.services.lambda.Permission;

import software.amazon.awscdk.services.iam.ServicePrincipal;

import software.constructs.Construct;

public class AdminApiStack extends Stack {

    public AdminApiStack(final Construct scope, final String id) {
        this(scope, id, null);
    }

    public AdminApiStack(final Construct scope, final String id, final StackProps props) {
        super(scope, id, props);

        // ------------------------------------------------------------
        // IMPORT DynamoDB table (DO NOT recreate)
        // ------------------------------------------------------------
        ITable experiencesTable = Table.fromTableName(
                this,
                "ExperiencesTable",
                ExperiencesStack.EXPERIENCES_TABLE_NAME
        );

        // ------------------------------------------------------------
        // Admin Lambda: WRITE ONLY
        // ------------------------------------------------------------
        Function createExperienceFunction =
                Function.Builder.create(this, "CreateExperienceFunction")
                        .functionName("CreateExperience")
                        .runtime(Runtime.JAVA_21)
                        .handler("com.jan.admin.CreateExperienceHandler")
                        .code(Code.fromAsset("../services/api/admin/target/admin.jar"))
                        .memorySize(1024)
                        .timeout(Duration.seconds(10))
                        .environment(Map.of(
                                "TABLE_NAME", experiencesTable.getTableName(),
                                "ADMIN_KEY", "change-me"
                        ))
                        .build();

        // WRITE permissions only
        experiencesTable.grantWriteData(createExperienceFunction);

        // ------------------------------------------------------------
        // Admin REST API (OpenAPI 3)
        // ------------------------------------------------------------
        SpecRestApi adminApi =
                SpecRestApi.Builder.create(this, "PortfolioAdminApi")
                        .restApiName("PortfolioAdminApi")
                        .apiDefinition(ApiDefinition.fromAsset("openapi/admin-api.yaml"))
                        .build();

        // ------------------------------------------------------------
        // Stage variable for Lambda routing
        // ------------------------------------------------------------
        CfnStage cfnStage = (CfnStage) adminApi
                .getDeploymentStage()
                .getNode()
                .getDefaultChild();

        cfnStage.addPropertyOverride(
                "Variables",
                Map.of(
                        "ExperienceFunction", createExperienceFunction.getFunctionName()
                )
        );

        adminApi.getDeploymentStage().getNode().addDependency(createExperienceFunction);

        // ------------------------------------------------------------
        // Allow API Gateway → Lambda
        // ------------------------------------------------------------
        createExperienceFunction.addPermission(
                "AllowAdminApiInvoke",
                Permission.builder()
                        .principal(new ServicePrincipal("apigateway.amazonaws.com"))
                        .action("lambda:InvokeFunction")
                        .sourceArn(adminApi.arnForExecuteApi("*", "/*", "*"))
                        .build()
        );
    }
}
