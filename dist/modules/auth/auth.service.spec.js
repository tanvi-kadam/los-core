"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const nestjs_pino_1 = require("nestjs-pino");
const bcrypt = require("bcrypt");
const auth_service_1 = require("./auth.service");
const user_repository_1 = require("./repositories/user.repository");
const user_role_repository_1 = require("./repositories/user-role.repository");
const redis_1 = require("../../infrastructure/redis");
jest.mock('bcrypt', () => ({ compare: jest.fn() }));
describe('AuthService', () => {
    let service;
    let userRepository;
    let userRoleRepository;
    let jwtService;
    let redis;
    const mockUser = {
        id: 'user-1',
        email: 'user@los.com',
        passwordHash: '$2b$10$hashed',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
        userRoles: [],
    };
    const mockRole = { id: 'role-1', name: 'MAKER', description: null, createdAt: new Date(), userRoles: [] };
    const mockUserRole = { id: 'ur-1', userId: 'user-1', roleId: 'role-1', assignedAt: new Date(), user: mockUser, role: mockRole };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                {
                    provide: user_repository_1.UserRepository,
                    useValue: {
                        findByEmail: jest.fn(),
                        findById: jest.fn(),
                        findByIdWithRoles: jest.fn(),
                    },
                },
                {
                    provide: user_role_repository_1.UserRoleRepository,
                    useValue: {
                        findPrimaryRoleByUserId: jest.fn(),
                    },
                },
                {
                    provide: jwt_1.JwtService,
                    useValue: {
                        sign: jest.fn().mockReturnValue('mock-token'),
                        verify: jest.fn(),
                    },
                },
                {
                    provide: config_1.ConfigService,
                    useValue: { get: jest.fn((key) => (key === 'JWT_ACCESS_EXPIRY' ? '15m' : key === 'JWT_REFRESH_EXPIRY' ? '7d' : 'secret')) },
                },
                {
                    provide: redis_1.RedisService,
                    useValue: { setWithTTL: jest.fn(), get: jest.fn() },
                },
                {
                    provide: nestjs_pino_1.PinoLogger,
                    useValue: { setContext: jest.fn(), info: jest.fn(), warn: jest.fn() },
                },
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
        userRepository = module.get(user_repository_1.UserRepository);
        userRoleRepository = module.get(user_role_repository_1.UserRoleRepository);
        jwtService = module.get(jwt_1.JwtService);
        redis = module.get(redis_1.RedisService);
        jest.clearAllMocks();
    });
    describe('login', () => {
        it('should return tokens on login success', async () => {
            userRepository.findByEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            userRoleRepository.findPrimaryRoleByUserId.mockResolvedValue(mockUserRole);
            const result = await service.login({ email: 'user@los.com', password: 'password' });
            expect(result.access_token).toBe('mock-token');
            expect(result.refresh_token).toBe('mock-token');
            expect(result.expires_in).toBeDefined();
            expect(userRepository.findByEmail).toHaveBeenCalledWith('user@los.com');
            expect(redis.setWithTTL).toHaveBeenCalled();
        });
        it('should throw UnauthorizedException on login failure - user not found', async () => {
            userRepository.findByEmail.mockResolvedValue(null);
            await expect(service.login({ email: 'unknown@los.com', password: 'password' })).rejects.toThrow(common_1.UnauthorizedException);
            expect(userRepository.findByEmail).toHaveBeenCalledWith('unknown@los.com');
        });
        it('should throw UnauthorizedException on login failure - invalid password', async () => {
            userRepository.findByEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);
            await expect(service.login({ email: 'user@los.com', password: 'wrong' })).rejects.toThrow(common_1.UnauthorizedException);
        });
    });
    describe('getMe', () => {
        it('should return current user when not cached', async () => {
            redis.get.mockResolvedValue(null);
            userRepository.findByIdWithRoles.mockResolvedValue(mockUser);
            userRoleRepository.findPrimaryRoleByUserId.mockResolvedValue(mockUserRole);
            const result = await service.getMe('user-1');
            expect(result.user_id).toBe('user-1');
            expect(result.email).toBe('user@los.com');
            expect(result.role_id).toBe('role-1');
        });
        it('should return cached user when available', async () => {
            const cached = { user_id: 'user-1', email: 'user@los.com', role_id: 'role-1' };
            redis.get.mockResolvedValue(JSON.stringify(cached));
            const result = await service.getMe('user-1');
            expect(result).toEqual(cached);
            expect(userRepository.findByIdWithRoles).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=auth.service.spec.js.map