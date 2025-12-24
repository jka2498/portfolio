package com.jan;

import software.amazon.awscdk.*;
import software.amazon.awscdk.aws_apigatewayv2_integrations.HttpLambdaIntegration;
import software.amazon.awscdk.services.apigatewayv2.AddRoutesOptions;
import software.amazon.awscdk.services.apigatewayv2.CorsPreflightOptions;
import software.amazon.awscdk.services.apigatewayv2.HttpApi;
import software.amazon.awscdk.services.apigatewayv2.HttpMethod;
import software.amazon.awscdk.services.dynamodb.Attribute;
import software.amazon.awscdk.services.dynamodb.AttributeType;
import software.amazon.awscdk.services.dynamodb.BillingMode;
import software.amazon.awscdk.services.dynamodb.Table;
import software.amazon.awscdk.services.lambda.Code;
import software.amazon.awscdk.services.lambda.Function;
import software.amazon.awscdk.services.s3.BlockPublicAccess;
import software.amazon.awscdk.services.s3.Bucket;
import software.constructs.Construct;

import java.util.List;
import java.util.Map;

import static software.amazon.awscdk.services.apigatewayv2.CorsHttpMethod.GET;
import static software.amazon.awscdk.services.apigatewayv2.CorsHttpMethod.OPTIONS;

public class ExperiencesStack extends Stack {

  public static final String EXPERIENCES_TABLE_NAME = "PortfolioExperiences";

  public ExperiencesStack(final Construct scope, final String id) {
    this(scope, id, null);
  }

  public ExperiencesStack(final Construct scope, final String id, final StackProps props) {
    super(scope, id, props);

    // ------------------------------------------------------------
    // DynamoDB: PortfolioExperiences
    // ------------------------------------------------------------
    Table experiencesTable =
            Table.Builder.create(this, "ExperiencesTable")
                    .tableName(EXPERIENCES_TABLE_NAME)
                    .partitionKey(Attribute.builder().name("id").type(AttributeType.STRING).build())
                    .billingMode(BillingMode.PAY_PER_REQUEST)
                    .removalPolicy(RemovalPolicy.RETAIN)
                    .build();

    Bucket cvBucket =
            Bucket.Builder.create(this, "CvBucket")
                    .blockPublicAccess(BlockPublicAccess.BLOCK_ALL)
                    .removalPolicy(RemovalPolicy.RETAIN)
                    .build();

    // ------------------------------------------------------------
    // Lambda: GetExperiences (READ ONLY)
    // ------------------------------------------------------------
    Function getExperiencesFunction =
            Function.Builder.create(this, "GetExperiencesFunction")
                    .functionName("GetExperiences")
                    .runtime(Runtime.JAVA_21)
                    .handler("com.jan.api.experiences.GetExperiencesHandler")
                    .code(Code.fromAsset("../services/api/experiences/target/experiences.jar"))
                    .memorySize(1024)
                    .timeout(Duration.seconds(10))
                    .environment(
                            Map.of(
                                    "TABLE_NAME",
                                    experiencesTable.getTableName(),
                                    "FRONTEND_ORIGIN",
                                    Fn.importValue("FrontendCloudFrontUrl")))
                    .build();

    experiencesTable.grantReadData(getExperiencesFunction);

    Function getProjectsFunction =
            Function.Builder.create(this, "GetProjectsFunction")
                    .functionName("GetProjects")
                    .runtime(Runtime.JAVA_21)
                    .handler("com.jan.api.projects.GetProjectsHandler")
                    .code(Code.fromAsset("../services/api/projects/target/projects.jar"))
                    .memorySize(1024)
                    .timeout(Duration.seconds(10))
                    .environment(
                            Map.of(
                                    "TABLE_NAME",
                                    experiencesTable.getTableName(),
                                    "FRONTEND_ORIGIN",
                                    Fn.importValue("FrontendCloudFrontUrl")))
                    .build();

    experiencesTable.grantReadData(getProjectsFunction);

    Function getCvDownloadUrlFunction =
            Function.Builder.create(this, "GetCvDownloadUrlFunction")
                    .functionName("GetCvDownloadUrl")
                    .runtime(Runtime.JAVA_21)
                    .handler("com.jan.api.experiences.GetCvDownloadUrlHandler")
                    .code(Code.fromAsset("../services/api/experiences/target/experiences.jar"))
                    .memorySize(512)
                    .timeout(Duration.seconds(10))
                    .environment(
                            Map.of(
                                    "CV_BUCKET",
                                    cvBucket.getBucketName(),
                                    "CV_OBJECT_KEY",
                                    "cv/jan-andrzejczyk.pdf",
                                    "FRONTEND_ORIGIN",
                                    Fn.importValue("FrontendCloudFrontUrl")))
                    .build();

    cvBucket.grantRead(getCvDownloadUrlFunction, "cv/jan-andrzejczyk.pdf");

    // ------------------------------------------------------------
    // Public API Gateway (HTTP API)
    // ------------------------------------------------------------

    String frontendUrl = Fn.importValue("FrontendCloudFrontUrl");

    HttpApi api =
            HttpApi.Builder.create(this, "PortfolioApi")
                    .apiName("PortfolioApi")
            .corsPreflight(
                CorsPreflightOptions.builder()
                    .allowOrigins(List.of("http://localhost:5173", frontendUrl))
                    .allowMethods(List.of(GET, OPTIONS))
                    .allowHeaders(List.of("*"))
                        .build())
                    .build();

    api.addRoutes(
            AddRoutesOptions.builder()
                    .path("/experiences")
                    .methods(List.of(HttpMethod.GET))
                    .integration(
                            new HttpLambdaIntegration("GetExperiencesIntegration", getExperiencesFunction))
                    .build());

    api.addRoutes(
            AddRoutesOptions.builder()
                    .path("/projects")
                    .methods(List.of(HttpMethod.GET))
                    .integration(new HttpLambdaIntegration("GetProjectsIntegration", getProjectsFunction))
                    .build());

    api.addRoutes(
            AddRoutesOptions.builder()
                    .path("/cv/download")
                    .methods(List.of(HttpMethod.GET))
                    .integration(
                            new HttpLambdaIntegration("GetCvDownloadUrlIntegration", getCvDownloadUrlFunction))
                    .build());

    CfnOutput.Builder.create(this, "CvBucketName")
            .value(cvBucket.getBucketName())
            .exportName("CvBucketName")
            .build();
  }
}
