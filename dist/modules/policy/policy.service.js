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
exports.PolicyService = void 0;
const common_1 = require("@nestjs/common");
const policy_repository_1 = require("./repositories/policy.repository");
let PolicyService = class PolicyService {
    constructor(repository) {
        this.repository = repository;
    }
    async create(dto) {
        const effectiveFrom = dto.effectiveFrom ? new Date(dto.effectiveFrom) : new Date();
        const existing = await this.repository.findByType(dto.policyType);
        const nextVersion = dto.version ?? (existing.length > 0 ? existing[0].version + 1 : 1);
        const created = await this.repository.save({
            policyType: dto.policyType,
            version: nextVersion,
            description: dto.description ?? null,
            effectiveFrom,
            approvedBy: dto.approvedBy ?? null,
        });
        return {
            id: created.id,
            policyType: created.policyType,
            version: created.version,
        };
    }
    async getAll() {
        const rows = await this.repository.findAll();
        return rows.map((r) => ({
            id: r.id,
            policyType: r.policyType,
            version: r.version,
            description: r.description,
            effectiveFrom: r.effectiveFrom,
            approvedBy: r.approvedBy,
            createdAt: r.createdAt,
        }));
    }
};
exports.PolicyService = PolicyService;
exports.PolicyService = PolicyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [policy_repository_1.PolicyRepository])
], PolicyService);
//# sourceMappingURL=policy.service.js.map