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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const nestjs_pino_1 = require("nestjs-pino");
const user_repository_1 = require("./repositories/user.repository");
const user_role_repository_1 = require("./repositories/user-role.repository");
const redis_1 = require("../../infrastructure/redis");
const AUTH_CACHE_PREFIX = 'AUTH:';
const AUTH_CACHE_TTL_SECONDS = 300;
let AuthService = AuthService_1 = class AuthService {
    constructor(userRepository, userRoleRepository, jwtService, config, redis, logger) {
        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
        this.jwtService = jwtService;
        this.config = config;
        this.redis = redis;
        this.logger = logger;
        this.logger.setContext(AuthService_1.name);
    }
    async login(dto, correlationId) {
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user) {
            this.logger.warn({ email: dto.email, correlation_id: correlationId }, 'login failure: user not found');
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const valid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!valid) {
            this.logger.warn({ email: dto.email, user_id: user.id, correlation_id: correlationId }, 'login failure: invalid password');
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const primaryRole = await this.userRoleRepository.findPrimaryRoleByUserId(user.id);
        const roleId = primaryRole?.role?.id ?? '';
        const payload = {
            sub: user.id,
            email: user.email,
            role_id: roleId,
        };
        const accessToken = this.jwtService.sign({ ...payload, type: 'access' }, { expiresIn: this.config.get('JWT_ACCESS_EXPIRY', '15m') });
        const refreshToken = this.jwtService.sign({ ...payload, type: 'refresh' }, { expiresIn: this.config.get('JWT_REFRESH_EXPIRY', '7d') });
        const expiresIn = this.parseExpiryToSeconds(this.config.get('JWT_ACCESS_EXPIRY', '15m'));
        this.logger.info({ user_id: user.id, email: user.email, role_id: roleId, correlation_id: correlationId }, 'login success');
        await this.setAuthCache(user.id, { user_id: user.id, email: user.email, role_id: roleId });
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: expiresIn,
        };
    }
    async refresh(refreshToken, correlationId) {
        let payload;
        try {
            payload = this.jwtService.verify(refreshToken);
        }
        catch {
            this.logger.warn({ correlation_id: correlationId }, 'token generation failed: invalid refresh token');
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
        if (payload.type !== 'refresh') {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const user = await this.userRepository.findById(payload.sub);
        if (!user) {
            throw new common_1.UnauthorizedException('User no longer exists');
        }
        const primaryRole = await this.userRoleRepository.findPrimaryRoleByUserId(user.id);
        const roleId = primaryRole?.role?.id ?? payload.role_id;
        const newPayload = {
            sub: user.id,
            email: user.email,
            role_id: roleId,
        };
        const accessToken = this.jwtService.sign({ ...newPayload, type: 'access' }, { expiresIn: this.config.get('JWT_ACCESS_EXPIRY', '15m') });
        const newRefreshToken = this.jwtService.sign({ ...newPayload, type: 'refresh' }, { expiresIn: this.config.get('JWT_REFRESH_EXPIRY', '7d') });
        this.logger.info({ user_id: user.id, correlation_id: correlationId }, 'token generation');
        await this.setAuthCache(user.id, { user_id: user.id, email: user.email, role_id: roleId });
        return {
            access_token: accessToken,
            refresh_token: newRefreshToken,
            expires_in: this.parseExpiryToSeconds(this.config.get('JWT_ACCESS_EXPIRY', '15m')),
        };
    }
    async getMe(userId) {
        const cached = await this.getAuthCache(userId);
        if (cached)
            return cached;
        const user = await this.userRepository.findByIdWithRoles(userId);
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        const primaryRole = await this.userRoleRepository.findPrimaryRoleByUserId(user.id);
        const roleId = primaryRole?.role?.id ?? '';
        const dto = { user_id: user.id, email: user.email, role_id: roleId };
        await this.setAuthCache(user.id, dto);
        return dto;
    }
    async validatePayload(payload) {
        if (payload.type !== 'access')
            return null;
        const cached = await this.getAuthCache(payload.sub);
        if (cached)
            return cached;
        const user = await this.userRepository.findById(payload.sub);
        if (!user)
            return null;
        const primaryRole = await this.userRoleRepository.findPrimaryRoleByUserId(user.id);
        const roleId = primaryRole?.role?.id ?? payload.role_id;
        return { user_id: user.id, email: user.email, role_id: roleId };
    }
    async getAuthCache(userId) {
        const raw = await this.redis.get(`${AUTH_CACHE_PREFIX}${userId}`);
        if (!raw)
            return null;
        try {
            return JSON.parse(raw);
        }
        catch {
            return null;
        }
    }
    async setAuthCache(userId, dto) {
        await this.redis.setWithTTL(`${AUTH_CACHE_PREFIX}${userId}`, JSON.stringify(dto), AUTH_CACHE_TTL_SECONDS);
    }
    parseExpiryToSeconds(expiry) {
        const match = expiry.match(/^(\d+)(m|s|h|d)$/);
        if (!match)
            return 900;
        const [, num, unit] = match;
        const n = parseInt(num, 10);
        switch (unit) {
            case 's': return n;
            case 'm': return n * 60;
            case 'h': return n * 3600;
            case 'd': return n * 86400;
            default: return 900;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        user_role_repository_1.UserRoleRepository,
        jwt_1.JwtService,
        config_1.ConfigService,
        redis_1.RedisService,
        nestjs_pino_1.PinoLogger])
], AuthService);
//# sourceMappingURL=auth.service.js.map