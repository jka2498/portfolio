package com.jan;

import software.amazon.awscdk.App;

public class InfraApp {
    public static void main(final String[] args) {
        App app = new App();

    new ExperiencesStack(app, "ExperiencesStack");
    new FrontendStack(app, "FrontendStack");
    new AdminApiStack(app, "AdminApiStack");

        app.synth();
    }
}

