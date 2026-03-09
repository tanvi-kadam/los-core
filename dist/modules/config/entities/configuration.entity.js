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
exports.Configuration = void 0;
const typeorm_1 = require("typeorm");
let Configuration = class Configuration {
};
exports.Configuration = Configuration;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Configuration.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'config_type', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Configuration.prototype, "configType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'config_key', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Configuration.prototype, "configKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'config_value', type: 'jsonb' }),
    __metadata("design:type", Object)
], Configuration.prototype, "configValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 1 }),
    __metadata("design:type", Number)
], Configuration.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'effective_from', type: 'timestamp' }),
    __metadata("design:type", Date)
], Configuration.prototype, "effectiveFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_by', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Configuration.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Configuration.prototype, "createdAt", void 0);
exports.Configuration = Configuration = __decorate([
    (0, typeorm_1.Entity)({ schema: 'config_schema', name: 'configurations' })
], Configuration);
//# sourceMappingURL=configuration.entity.js.map