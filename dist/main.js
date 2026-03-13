"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./instrumentation");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nestjs_pino_1 = require("nestjs-pino");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const correlation_id_middleware_1 = require("./common/middleware/correlation-id.middleware");
const response_transform_interceptor_1 = require("./common/interceptors/response-transform.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bufferLogs: true });
    app.setGlobalPrefix("api", {
        exclude: [
            { path: "auth/login", method: common_1.RequestMethod.POST },
            { path: "auth/refresh", method: common_1.RequestMethod.POST },
            { path: "auth/me", method: common_1.RequestMethod.GET },
        ],
    });
    app.use(correlation_id_middleware_1.correlationIdMiddleware);
    app.useLogger(app.get(nestjs_pino_1.Logger));
    app.useGlobalInterceptors(new response_transform_interceptor_1.ResponseTransformInterceptor());
    const configService = app.get(config_1.ConfigService);
    const port = configService.get("PORT", 3000);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle("LOS Core API")
        .setDescription("Fintech Loan Origination System - Core Backend API")
        .setVersion("1.0")
        .addTag("health", "Health check endpoints")
        .addTag("auth", "Authentication")
        .addTag("authority", "Authority & RBAC")
        .addTag("config", "Configuration")
        .addTag("policy", "Policy Registry")
        .addTag("application", "Loan applications")
        .addTag("workflow", "Application state workflow")
        .addTag("approval", "Maker-checker approval")
        .addTag("integration", "MCA / external integration")
        .addTag("aml", "AML risk engine")
        .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" }, "jwt")
        .addApiKey({ type: "apiKey", name: "X-Correlation-ID", in: "header" }, "X-Correlation-ID")
        .addApiKey({ type: "apiKey", name: "X-Idempotency-Key", in: "header" }, "X-Idempotency-Key")
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("docs", app, document);
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map