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
exports.IdempotencyKey = void 0;
const typeorm_1 = require("typeorm");
let IdempotencyKey = class IdempotencyKey {
};
exports.IdempotencyKey = IdempotencyKey;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], IdempotencyKey.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'idempotency_key', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], IdempotencyKey.prototype, "idempotencyKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], IdempotencyKey.prototype, "endpoint", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], IdempotencyKey.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'request_hash', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], IdempotencyKey.prototype, "requestHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'response_snapshot', type: 'jsonb' }),
    __metadata("design:type", Object)
], IdempotencyKey.prototype, "responseSnapshot", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'COMPLETED' }),
    __metadata("design:type", String)
], IdempotencyKey.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expires_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], IdempotencyKey.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], IdempotencyKey.prototype, "createdAt", void 0);
exports.IdempotencyKey = IdempotencyKey = __decorate([
    (0, typeorm_1.Entity)({ schema: 'idempotency_schema', name: 'idempotency_keys' })
], IdempotencyKey);
//# sourceMappingURL=idempotency-key.entity.js.map