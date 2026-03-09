"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
const crypto_1 = require("crypto");
const redis_constants_1 = require("./redis.constants");
const RELEASE_SCRIPT = `
  if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
  else
    return 0
  end
`;
let RedisService = class RedisService {
    constructor(client) {
        this.client = client;
    }
    async onModuleDestroy() {
        this.client.disconnect();
    }
    async get(key) {
        return this.client.get(key);
    }
    async set(key, value) {
        await this.client.set(key, value);
    }
    async setWithTTL(key, value, ttlSeconds) {
        await this.client.set(key, value, 'EX', ttlSeconds);
    }
    async delete(key) {
        await this.client.del(key);
    }
    async acquireLock(key, ttlMs) {
        const token = (0, crypto_1.randomUUID)();
        const result = await this.client.set(key, token, 'PX', ttlMs, 'NX');
        return result === 'OK' ? token : null;
    }
    async releaseLock(key, token) {
        const result = await this.client.eval(RELEASE_SCRIPT, 1, key, token);
        return result === 1;
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(redis_constants_1.REDIS_CLIENT)),
    __metadata("design:paramtypes", [ioredis_1.default])
], RedisService);
//# sourceMappingURL=redis.service.js.map