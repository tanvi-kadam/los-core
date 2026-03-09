import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { DatabaseModule } from './infrastructure/database';
import { KafkaModule } from './infrastructure/kafka';
import { MinioModule } from './infrastructure/minio';
import { RedisModule } from './infrastructure/redis';
import { TemporalModule } from './infrastructure/temporal';
import { AuthModule } from './modules/auth/auth.module';
import { AuthorityModule } from './modules/authority/authority.module';
import { HealthModule } from './modules/health/health.module';
import { IdempotencyModule } from './modules/idempotency/idempotency.module';
import { AuditModule } from './modules/audit/audit.module';
import { ConfigModule as ConfigDomainModule } from './modules/config/config.module';
import { PolicyModule } from './modules/policy/policy.module';
import { ApplicationModule } from './modules/application/application.module';
import { WorkflowModule } from './modules/workflow/workflow.module';
import { ApprovalModule } from './modules/approval/approval.module';
import { IntegrationModule } from './modules/integration/integration.module';
import { AmlModule } from './modules/aml/aml.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env['NODE_ENV'] !== 'production' ? 'debug' : 'info',
        messageKey: 'message',
        timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
        transport:
          process.env['NODE_ENV'] !== 'production'
            ? { target: 'pino-pretty', options: { colorize: true } }
            : undefined,
        serializers: {
          req: (req: { id?: string; method?: string; url?: string; headers?: Record<string, string | undefined> }) => ({
            id: req.id,
            method: req.method,
            url: req.url,
          }),
          res: (res: { statusCode?: number }) => ({
            statusCode: res.statusCode,
          }),
        },
        customProps: (req: { correlationId?: string; headers?: Record<string, string | string[] | undefined> }) => ({
          service: 'los-core',
          correlation_id: req?.correlationId ?? (typeof req?.headers?.['x-correlation-id'] === 'string' ? req.headers['x-correlation-id'] : undefined),
        }),
        redact: ['req.headers.authorization'],
        autoLogging: true,
      },
    }),
    DatabaseModule,
    RedisModule,
    MinioModule,
    KafkaModule,
    TemporalModule,
    AuthModule,
    AuthorityModule,
    HealthModule,
    IdempotencyModule,
    AuditModule,
    ConfigDomainModule,
    PolicyModule,
    ApplicationModule,
    WorkflowModule,
    ApprovalModule,
    IntegrationModule,
    AmlModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
