"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = require("ioredis");
const redis_constants_1 = require("./redis.constants");
const redis_service_1 = require("./redis.service");
let RedisModule = class RedisModule {
};
exports.RedisModule = RedisModule;
exports.RedisModule = RedisModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [
            {
                provide: redis_constants_1.REDIS_CLIENT,
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const host = config.get("REDIS_HOST", "redis");
                    const port = config.get("REDIS_PORT", 6379);
                    const password = config.get("REDIS_PASSWORD", "IlM3x9C7I6Bw7QsjB70s8TTFCfanwPKQxqFnUii0");
                    return new ioredis_1.default({
                        host,
                        port,
                        ...(password && { password }),
                        maxRetriesPerRequest: 3,
                        retryStrategy: (times) => times <= 3 ? Math.min(times * 100, 3000) : null,
                        lazyConnect: true,
                    });
                },
            },
            redis_service_1.RedisService,
        ],
        exports: [redis_service_1.RedisService],
    })
], RedisModule);
//# sourceMappingURL=redis.module.js.map