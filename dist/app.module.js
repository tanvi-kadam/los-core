"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const nestjs_pino_1 = require("nestjs-pino");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const database_1 = require("./infrastructure/database");
const kafka_1 = require("./infrastructure/kafka");
const minio_1 = require("./infrastructure/minio");
const redis_1 = require("./infrastructure/redis");
const temporal_1 = require("./infrastructure/temporal");
const auth_module_1 = require("./modules/auth/auth.module");
const authority_module_1 = require("./modules/authority/authority.module");
const health_module_1 = require("./modules/health/health.module");
const idempotency_module_1 = require("./modules/idempotency/idempotency.module");
const audit_module_1 = require("./modules/audit/audit.module");
const config_module_1 = require("./modules/config/config.module");
const policy_module_1 = require("./modules/policy/policy.module");
const application_module_1 = require("./modules/application/application.module");
const workflow_module_1 = require("./modules/workflow/workflow.module");
const approval_module_1 = require("./modules/approval/approval.module");
const integration_module_1 = require("./modules/integration/integration.module");
const aml_module_1 = require("./modules/aml/aml.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env.local', '.env'],
            }),
            nestjs_pino_1.LoggerModule.forRoot({
                pinoHttp: {
                    level: process.env['NODE_ENV'] !== 'production' ? 'debug' : 'info',
                    messageKey: 'message',
                    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
                    transport: process.env['NODE_ENV'] !== 'production'
                        ? { target: 'pino-pretty', options: { colorize: true } }
                        : undefined,
                    serializers: {
                        req: (req) => ({
                            id: req.id,
                            method: req.method,
                            url: req.url,
                        }),
                        res: (res) => ({
                            statusCode: res.statusCode,
                        }),
                    },
                    customProps: (req) => ({
                        service: 'los-core',
                        correlation_id: req?.correlationId ?? (typeof req?.headers?.['x-correlation-id'] === 'string' ? req.headers['x-correlation-id'] : undefined),
                    }),
                    redact: ['req.headers.authorization'],
                    autoLogging: true,
                },
            }),
            database_1.DatabaseModule,
            redis_1.RedisModule,
            minio_1.MinioModule,
            kafka_1.KafkaModule,
            temporal_1.TemporalModule,
            auth_module_1.AuthModule,
            authority_module_1.AuthorityModule,
            health_module_1.HealthModule,
            idempotency_module_1.IdempotencyModule,
            audit_module_1.AuditModule,
            config_module_1.ConfigModule,
            policy_module_1.PolicyModule,
            application_module_1.ApplicationModule,
            workflow_module_1.WorkflowModule,
            approval_module_1.ApprovalModule,
            integration_module_1.IntegrationModule,
            aml_module_1.AmlModule,
        ],
        providers: [
            { provide: core_1.APP_FILTER, useClass: http_exception_filter_1.AllExceptionsFilter },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map