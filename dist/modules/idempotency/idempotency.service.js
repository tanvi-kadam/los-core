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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdempotencyService = void 0;
const common_1 = require("@nestjs/common");
const idempotency_repository_1 = require("./repositories/idempotency.repository");
const IDEMPOTENCY_TTL_HOURS = 24;
let IdempotencyService = class IdempotencyService {
    constructor(repository) {
        this.repository = repository;
    }
    async check(key, endpoint, requestHash, userId) {
        const record = await this.repository.findByKey(key);
        if (!record)
            return null;
        if (record.requestHash !== requestHash) {
            throw new common_1.ConflictException('Idempotency key already used with a different request body');
        }
        if (new Date() > record.expiresAt)
            return null;
        return record.responseSnapshot;
    }
    async getStoredResponse(key) {
        const record = await this.repository.findByKey(key);
        if (!record || new Date() > record.expiresAt)
            return null;
        return record.responseSnapshot;
    }
    async store(key, endpoint, userId, requestHash, responseSnapshot, status = 'COMPLETED') {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + IDEMPOTENCY_TTL_HOURS);
        return this.repository.save({
            idempotencyKey: key,
            endpoint,
            userId,
            requestHash,
            responseSnapshot,
            status,
            expiresAt,
        });
    }
};
exports.IdempotencyService = IdempotencyService;
exports.IdempotencyService = IdempotencyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [idempotency_repository_1.IdempotencyRepository])
], IdempotencyService);
//# sourceMappingURL=idempotency.service.js.map