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
var AuthorityService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorityService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_pino_1 = require("nestjs-pino");
const redis_1 = require("../../infrastructure/redis");
const authority_repository_1 = require("./repositories/authority.repository");
const AUTHORITY_CACHE_PREFIX = "AUTHORITY:";
const AUTHORITY_CACHE_TTL_SECONDS = 600;
let AuthorityService = AuthorityService_1 = class AuthorityService {
    constructor(authorityRepository, redis, logger) {
        this.authorityRepository = authorityRepository;
        this.redis = redis;
        this.logger = logger;
        this.logger.setContext(AuthorityService_1.name);
    }
    async createAuthorityRule(dto) {
        const entity = await this.authorityRepository.create({
            roleId: dto.role_id,
            maxLoanAmount: String(dto.max_loan_amount),
            maxDeviationPercent: dto.max_deviation_percent != null
                ? String(dto.max_deviation_percent)
                : null,
            allowedProducts: dto.allowed_products ?? null,
            allowedGeographies: dto.allowed_geographies ?? null,
            effectiveFrom: new Date(dto.effective_from),
            effectiveTo: dto.effective_to ? new Date(dto.effective_to) : null,
        });
        await this.invalidateAuthorityCache(dto.role_id);
        return this.toDto(entity);
    }
    async updateAuthorityRule(id, dto) {
        const existing = await this.authorityRepository.findById(id);
        if (!existing)
            throw new common_1.NotFoundException("Authority matrix not found");
        const entity = await this.authorityRepository.update(id, {
            ...(dto.role_id != null && { roleId: dto.role_id }),
            ...(dto.max_loan_amount != null && {
                maxLoanAmount: String(dto.max_loan_amount),
            }),
            ...(dto.max_deviation_percent != null && {
                maxDeviationPercent: String(dto.max_deviation_percent),
            }),
            ...(dto.allowed_products !== undefined && {
                allowedProducts: dto.allowed_products,
            }),
            ...(dto.allowed_geographies !== undefined && {
                allowedGeographies: dto.allowed_geographies,
            }),
            ...(dto.effective_from != null && {
                effectiveFrom: new Date(dto.effective_from),
            }),
            ...(dto.effective_to !== undefined && {
                effectiveTo: dto.effective_to ? new Date(dto.effective_to) : null,
            }),
        });
        await this.invalidateAuthorityCache(existing.roleId);
        if (entity.roleId !== existing.roleId)
            await this.invalidateAuthorityCache(entity.roleId);
        return this.toDto(entity);
    }
    async getAuthorityForRole(roleId) {
        const cached = await this.getAuthorityCache(roleId);
        console.log("Cached-", cached);
        if (cached && cached.length > 0)
            return cached;
        const list = await this.authorityRepository.findActiveByRoleId(roleId);
        console.log("List-", list);
        const dtos = list.map((e) => this.toDto(e));
        await this.setAuthorityCache(roleId, dtos);
        return dtos;
    }
    async checkAuthorityLimit(roleId, loanAmount, makerId, checkerId) {
        if (makerId && checkerId && makerId === checkerId) {
            this.logger.warn({ makerId, checkerId }, "maker_id must not equal checker_id");
            throw new common_1.ForbiddenException("Maker and checker must be different");
        }
        const rules = await this.getAuthorityForRole(roleId);
        console.log("Rulessssssssssss-", rules);
        if (rules.length === 0) {
            throw new common_1.ForbiddenException("No authority rule found for role");
        }
        const maxAmount = rules.reduce((max, r) => Math.max(max, parseFloat(r.max_loan_amount)), 0);
        if (loanAmount > maxAmount) {
            this.logger.warn({ roleId, loanAmount, maxAmount }, "authority limit exceeded");
            throw new common_1.ForbiddenException(`Loan amount exceeds authority limit (max: ${maxAmount})`);
        }
    }
    async getAuthorityCache(roleId) {
        const raw = await this.redis.get(`${AUTHORITY_CACHE_PREFIX}${roleId}`);
        if (!raw)
            return null;
        try {
            return JSON.parse(raw);
        }
        catch {
            return null;
        }
    }
    async setAuthorityCache(roleId, rules) {
        await this.redis.setWithTTL(`${AUTHORITY_CACHE_PREFIX}${roleId}`, JSON.stringify(rules), AUTHORITY_CACHE_TTL_SECONDS);
    }
    async invalidateAuthorityCache(roleId) {
        await this.redis.delete(`${AUTHORITY_CACHE_PREFIX}${roleId}`);
    }
    toDto(e) {
        return {
            id: e.id,
            role_id: e.roleId,
            max_loan_amount: e.maxLoanAmount,
            max_deviation_percent: e.maxDeviationPercent,
            allowed_products: e.allowedProducts,
            allowed_geographies: e.allowedGeographies,
            effective_from: e.effectiveFrom.toISOString(),
            effective_to: e.effectiveTo?.toISOString() ?? null,
        };
    }
};
exports.AuthorityService = AuthorityService;
exports.AuthorityService = AuthorityService = AuthorityService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [authority_repository_1.AuthorityRepository,
        redis_1.RedisService,
        nestjs_pino_1.PinoLogger])
], AuthorityService);
//# sourceMappingURL=authority.service.js.map