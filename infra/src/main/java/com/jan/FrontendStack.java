package com.jan;

import java.util.List;
import software.amazon.awscdk.RemovalPolicy;
import software.amazon.awscdk.Stack;
import software.amazon.awscdk.StackProps;
import software.amazon.awscdk.services.cloudfront.BehaviorOptions;
import software.amazon.awscdk.services.cloudfront.Distribution;
import software.amazon.awscdk.services.cloudfront.ViewerProtocolPolicy;
import software.amazon.awscdk.services.cloudfront.origins.S3BucketOrigin;
import software.amazon.awscdk.services.s3.BlockPublicAccess;
import software.amazon.awscdk.services.s3.Bucket;
import software.amazon.awscdk.services.s3.deployment.BucketDeployment;
import software.amazon.awscdk.services.s3.deployment.Source;
import software.constructs.Construct;

public class FrontendStack extends Stack {

  public FrontendStack(final Construct scope, final String id) {
    this(scope, id, null);
  }

  public FrontendStack(final Construct scope, final String id, final StackProps props) {
    super(scope, id, props);

    // ------------------------------------------------------------
    // S3 bucket for frontend
    // ------------------------------------------------------------
    Bucket siteBucket =
        Bucket.Builder.create(this, "FrontendBucket")
            .blockPublicAccess(BlockPublicAccess.BLOCK_ALL)
            .removalPolicy(RemovalPolicy.DESTROY)
            .autoDeleteObjects(true)
            .build();

    // ------------------------------------------------------------
    // CloudFront distribution
    // ------------------------------------------------------------
    Distribution distribution =
        Distribution.Builder.create(this, "FrontendDistribution")
            .defaultBehavior(
                BehaviorOptions.builder()
                    .origin(S3BucketOrigin.withOriginAccessControl(siteBucket))
                    .viewerProtocolPolicy(ViewerProtocolPolicy.REDIRECT_TO_HTTPS)
                    .build())
            .defaultRootObject("index.html")
            .build();

    // ------------------------------------------------------------
    // Deploy frontend build output
    // ------------------------------------------------------------
    BucketDeployment.Builder.create(this, "DeployFrontend")
        .sources(List.of(Source.asset("../frontend/dist")))
        .destinationBucket(siteBucket)
        .distribution(distribution)
        .distributionPaths(List.of("/*"))
        .build();
  }
}
