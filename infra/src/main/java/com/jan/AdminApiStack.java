package com.jan;

import software.amazon.awscdk.*;
import software.amazon.awscdk.services.apigateway.*;
import software.amazon.awscdk.services.cognito.*;
import software.amazon.awscdk.services.dynamodb.ITable;
import software.amazon.awscdk.services.dynamodb.Table;
import software.amazon.awscdk.services.iam.ServicePrincipal;
import software.amazon.awscdk.services.lambda.Code;
import software.amazon.awscdk.services.lambda.Function;
import software.amazon.awscdk.services.lambda.Permission;
import software.amazon.awscdk.services.lambda.Runtime;
import software.constructs.Construct;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AdminApiStack extends Stack {

  public AdminApiStack(final Construct scope, final String id) {
    this(scope, id, null);
  }

  public AdminApiStack(final Construct scope, final String id, final StackProps props) {
    super(scope, id, props);

    // ------------------------------------------------------------
    // IMPORT DynamoDB table (DO NOT recreate)
    // ------------------------------------------------------------
    ITable experiencesTable =
        Table.fromTableName(this, "ExperiencesTable", ExperiencesStack.EXPERIENCES_TABLE_NAME);

    // ------------------------------------------------------------
    // Admin Lambda: WRITE ONLY
    // ------------------------------------------------------------
    Function createExperienceFunction =
        Function.Builder.create(this, "CreateExperienceFunction")
                .functionName("CreateExperience")
                .runtime(Runtime.JAVA_21)
                .handler("com.jan.api.admin.CreateExperienceHandler")
            .code(Code.fromAsset("../services/api/admin/target/admin.jar"))
            .memorySize(1024)
            .timeout(Duration.seconds(10))
            .environment(
                Map.of(
                    "TABLE_NAME", experiencesTable.getTableName(),
                    "FRONTEND_ORIGIN", Fn.importValue("FrontendCloudFrontUrl")))
            .build();

    // WRITE permissions only
    experiencesTable.grantWriteData(createExperienceFunction);

    Function updateExperienceFunction =
            Function.Builder.create(this, "UpdateExperienceFunction")
                    .functionName("UpdateExperience")
                    .runtime(Runtime.JAVA_21)
                    .handler("com.jan.api.admin.UpdateExperienceHandler")
            .code(Code.fromAsset("../services/api/admin/target/admin.jar"))
            .memorySize(1024)
                    .timeout(Duration.seconds(10))
                    .environment(
                            Map.of(
                                    "TABLE_NAME", experiencesTable.getTableName(),
                                    "FRONTEND_ORIGIN", Fn.importValue("FrontendCloudFrontUrl")))
                    .build();

    // WRITE permissions only
    experiencesTable.grantWriteData(updateExperienceFunction);

    Function createProjectFunction =
            Function.Builder.create(this, "CreateProjectFunction")
                    .functionName("CreateProject")
                    .runtime(Runtime.JAVA_21)
                    .handler("com.jan.api.admin.CreateProjectHandler")
                    .code(Code.fromAsset("../services/api/admin/target/admin.jar"))
                    .memorySize(1024)
                    .timeout(Duration.seconds(10))
                    .environment(
                            Map.of(
                                    "TABLE_NAME", experiencesTable.getTableName(),
                                    "FRONTEND_ORIGIN", Fn.importValue("FrontendCloudFrontUrl")))
                    .build();

    experiencesTable.grantWriteData(createProjectFunction);

    Function updateProjectFunction =
            Function.Builder.create(this, "UpdateProjectFunction")
                    .functionName("UpdateProject")
                    .runtime(Runtime.JAVA_21)
                    .handler("com.jan.api.admin.UpdateProjectHandler")
                    .code(Code.fromAsset("../services/api/admin/target/admin.jar"))
                    .memorySize(1024)
                    .timeout(Duration.seconds(10))
                    .environment(
                            Map.of(
                                    "TABLE_NAME", experiencesTable.getTableName(),
                                    "FRONTEND_ORIGIN", Fn.importValue("FrontendCloudFrontUrl")))
                    .build();

    experiencesTable.grantWriteData(updateProjectFunction);

    // ------------------------------------------------------------
    // Admin REST API (OpenAPI 3)
    // ------------------------------------------------------------
    SpecRestApi adminApi =
            SpecRestApi.Builder.create(this, "PortfolioAdminApi")
                    .restApiName("PortfolioAdminApi")
                    .apiDefinition(ApiDefinition.fromAsset("openapi/admin-api.yaml"))
                    .build();

    String frontendUrl = Fn.importValue("FrontendCloudFrontUrl");
    String quotedFrontendUrl = "'" + frontendUrl + "'";

    adminApi.addGatewayResponse(
        "Cors4xx",
        GatewayResponseOptions.builder()
            .type(ResponseType.DEFAULT_4_XX)
            .responseHeaders(
                Map.of(
                    "Access-Control-Allow-Origin", quotedFrontendUrl,
                    "Access-Control-Allow-Headers", "'Content-Type,Authorization'",
                    "Access-Control-Allow-Methods", "'OPTIONS,GET,POST,PUT'"))
            .build());

    adminApi.addGatewayResponse(
        "Cors5xx",
        GatewayResponseOptions.builder()
            .type(ResponseType.DEFAULT_5_XX)
            .responseHeaders(
                Map.of(
                    "Access-Control-Allow-Origin", quotedFrontendUrl,
                    "Access-Control-Allow-Headers", "'Content-Type,Authorization'",
                    "Access-Control-Allow-Methods", "'OPTIONS,GET,POST,PUT'"))
            .build());

    // ------------------------------------------------------------
    // Allow API Gateway → Lambda
    // ------------------------------------------------------------
    createExperienceFunction.addPermission(
        "AllowAdminApiInvoke",
        Permission.builder()
            .principal(new ServicePrincipal("apigateway.amazonaws.com"))
            .action("lambda:InvokeFunction")
            .sourceArn(adminApi.arnForExecuteApi("*", "/*", "*"))
                .build());

    updateExperienceFunction.addPermission(
            "AllowUpdateExperienceInvoke",
            Permission.builder()
                    .principal(new ServicePrincipal("apigateway.amazonaws.com"))
                    .action("lambda:InvokeFunction")
                    .sourceArn(adminApi.arnForExecuteApi("*", "/*", "*"))
                    .build());

    createProjectFunction.addPermission(
            "AllowCreateProjectInvoke",
            Permission.builder()
                    .principal(new ServicePrincipal("apigateway.amazonaws.com"))
                    .action("lambda:InvokeFunction")
                    .sourceArn(adminApi.arnForExecuteApi("*", "/*", "*"))
                    .build());

    updateProjectFunction.addPermission(
            "AllowUpdateProjectInvoke",
            Permission.builder()
                    .principal(new ServicePrincipal("apigateway.amazonaws.com"))
                    .action("lambda:InvokeFunction")
                    .sourceArn(adminApi.arnForExecuteApi("*", "/*", "*"))
                    .build());

    // ------------------------------------------------------------
    // Cognito: User Pool (Hosted UI)
    // ------------------------------------------------------------
    UserPool userPool =
            UserPool.Builder.create(this, "AdminUserPool")
                    .userPoolName("PortfolioAdminUserPool")
                    .selfSignUpEnabled(false) // admin-only
                    .signInAliases(
                            software.amazon.awscdk.services.cognito.SignInAliases.builder().email(true).build())
            .removalPolicy(RemovalPolicy.RETAIN)
            .build();

    adminApi.getDeploymentStage().getNode().addDependency(userPool);

    UserPoolClient userPoolClient =
        userPool.addClient(
            "AdminUserPoolClient",
            UserPoolClientOptions.builder()
                .userPoolClientName("PortfolioAdminClient")
                .generateSecret(false) // SPA
                .supportedIdentityProviders(List.of(UserPoolClientIdentityProvider.COGNITO))
                .oAuth(
                    OAuthSettings.builder()
                        .flows(OAuthFlows.builder().authorizationCodeGrant(true).build())
                        .scopes(List.of(OAuthScope.OPENID, OAuthScope.EMAIL, OAuthScope.PROFILE))
                        .callbackUrls(
                            List.of(
                                frontendUrl + "/auth/callback",
                                "http://localhost:5173/auth/callback" // dev
                                ))
                        .logoutUrls(
                            List.of(
                                frontendUrl + "/", "http://localhost:5173/" // dev
                                ))
                        .build())
                .build());

    UserPoolDomain domain =
        userPool.addDomain(
            "AdminUserPoolDomain",
            UserPoolDomainOptions.builder()
                .cognitoDomain(
                    software.amazon.awscdk.services.cognito.CognitoDomainOptions.builder()
                        .domainPrefix(
                            "jan-portfolio-admin-" + this.getAccount()) // must be globally unique
                        .build())
                .build());

    // Helpful outputs
    CfnOutput.Builder.create(this, "CognitoHostedUiUrl")
        .value(
            "https://"
                + domain.getDomainName()
                + ".auth."
                + this.getRegion()
                + ".amazoncognito.com")
        .build();

    CfnOutput.Builder.create(this, "UserPoolId").value(userPool.getUserPoolId()).build();

    CfnOutput.Builder.create(this, "UserPoolClientId")
        .value(userPoolClient.getUserPoolClientId())
            .build();

    // ------------------------------------------------------------
    // Stage variable for Lambda routing
    // ------------------------------------------------------------
    CfnStage cfnStage = (CfnStage) adminApi.getDeploymentStage().getNode().getDefaultChild();

    Map<String, String> stageVars = new HashMap<>();
    stageVars.put("ExperienceFunction", createExperienceFunction.getFunctionName());
    stageVars.put("UpdateExperienceFunction", updateExperienceFunction.getFunctionName());
    stageVars.put("ProjectFunction", createProjectFunction.getFunctionName());
    stageVars.put("UpdateProjectFunction", updateProjectFunction.getFunctionName());
    stageVars.put("UserPoolId", userPool.getUserPoolId());

    cfnStage.addPropertyOverride("Variables", stageVars);

    adminApi.getDeploymentStage().getNode().addDependency(createExperienceFunction);
    adminApi.getDeploymentStage().getNode().addDependency(updateExperienceFunction);
    adminApi.getDeploymentStage().getNode().addDependency(createProjectFunction);
    adminApi.getDeploymentStage().getNode().addDependency(updateProjectFunction);
  }
}
