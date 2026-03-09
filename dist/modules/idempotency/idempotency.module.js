"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdempotencyModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const idempotency_key_entity_1 = require("./entities/idempotency-key.entity");
const idempotency_repository_1 = require("./repositories/idempotency.repository");
const idempotency_service_1 = require("./idempotency.service");
const idempotency_middleware_1 = require("./idempotency.middleware");
const idempotency_store_interceptor_1 = require("./interceptors/idempotency-store.interceptor");
const core_1 = require("@nestjs/core");
let IdempotencyModule = class IdempotencyModule {
    configure(consumer) {
        consumer
            .apply(idempotency_middleware_1.IdempotencyMiddleware)
            .forRoutes('applications', 'applications/*/transition', 'approvals', 'approvals/*/decision');
    }
};
exports.IdempotencyModule = IdempotencyModule;
exports.IdempotencyModule = IdempotencyModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([idempotency_key_entity_1.IdempotencyKey])],
        providers: [
            idempotency_repository_1.IdempotencyRepository,
            idempotency_service_1.IdempotencyService,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: idempotency_store_interceptor_1.IdempotencyStoreInterceptor,
            },
        ],
        exports: [idempotency_service_1.IdempotencyService],
    })
], IdempotencyModule);
//# sourceMappingURL=idempotency.module.js.map