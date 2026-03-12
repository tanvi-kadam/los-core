import "./instrumentation";
import { NestFactory } from "@nestjs/core";
import { RequestMethod, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Logger } from "nestjs-pino";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { correlationIdMiddleware } from "./common/middleware/correlation-id.middleware";
import { ResponseTransformInterceptor } from "./common/interceptors/response-transform.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.setGlobalPrefix("api", {
    exclude: [
      { path: "auth/login", method: RequestMethod.POST },
      { path: "auth/refresh", method: RequestMethod.POST },
      { path: "auth/me", method: RequestMethod.GET },
    ],
  });

  app.use(correlationIdMiddleware);
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT", 3000);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const config = new DocumentBuilder()
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
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      "jwt",
    )
    .addApiKey(
      { type: "apiKey", name: "X-Correlation-ID", in: "header" },
      "X-Correlation-ID",
    )
    .addApiKey(
      { type: "apiKey", name: "X-Idempotency-Key", in: "header" },
      "X-Idempotency-Key",
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  await app.listen(port);
}

bootstrap();
