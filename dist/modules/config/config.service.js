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
exports.ConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_repository_1 = require("./repositories/config.repository");
let ConfigService = class ConfigService {
    constructor(repository) {
        this.repository = repository;
    }
    async create(dto) {
        const effectiveFrom = dto.effectiveFrom ? new Date(dto.effectiveFrom) : new Date();
        const existing = await this.repository.findByType(dto.configType, effectiveFrom);
        const nextVersion = existing.length > 0 ? (existing[0].version ?? 1) + 1 : 1;
        const created = await this.repository.save({
            configType: dto.configType,
            configKey: dto.configKey,
            configValue: dto.configValue,
            version: nextVersion,
            effectiveFrom,
            approvedBy: dto.approvedBy ?? null,
        });
        return {
            id: created.id,
            configType: created.configType,
            configKey: created.configKey,
            version: created.version,
        };
    }
    async getByType(configType) {
        const rows = await this.repository.findByType(configType);
        return rows.map((r) => ({
            id: r.id,
            config_type: r.configType,
            config_key: r.configKey,
            config_value: r.configValue,
            version: r.version,
            effective_from: r.effectiveFrom,
            approved_by: r.approvedBy,
            created_at: r.createdAt,
        }));
    }
};
exports.ConfigService = ConfigService;
exports.ConfigService = ConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_repository_1.ConfigRepository])
], ConfigService);
//# sourceMappingURL=config.service.js.map