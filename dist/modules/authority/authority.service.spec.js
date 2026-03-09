"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const nestjs_pino_1 = require("nestjs-pino");
const authority_service_1 = require("./authority.service");
const authority_repository_1 = require("./repositories/authority.repository");
const redis_1 = require("../../infrastructure/redis");
describe('AuthorityService', () => {
    let service;
    let repository;
    let redis;
    const mockRule = {
        id: 'am-1',
        roleId: 'role-1',
        maxLoanAmount: '1000000',
        maxDeviationPercent: '5',
        allowedProducts: ['WORKING_CAPITAL'],
        allowedGeographies: ['IN'],
        effectiveFrom: new Date('2025-01-01'),
        effectiveTo: null,
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                authority_service_1.AuthorityService,
                {
                    provide: authority_repository_1.AuthorityRepository,
                    useValue: {
                        create: jest.fn(),
                        update: jest.fn(),
                        findById: jest.fn(),
                        findActiveByRoleId: jest.fn(),
                    },
                },
                {
                    provide: redis_1.RedisService,
                    useValue: { get: jest.fn(), setWithTTL: jest.fn(), delete: jest.fn() },
                },
                {
                    provide: nestjs_pino_1.PinoLogger,
                    useValue: { setContext: jest.fn(), warn: jest.fn() },
                },
            ],
        }).compile();
        service = module.get(authority_service_1.AuthorityService);
        repository = module.get(authority_repository_1.AuthorityRepository);
        redis = module.get(redis_1.RedisService);
        jest.clearAllMocks();
    });
    describe('checkAuthorityLimit', () => {
        it('should throw when maker_id equals checker_id', async () => {
            redis.get.mockResolvedValue(null);
            repository.findActiveByRoleId.mockResolvedValue([mockRule]);
            await expect(service.checkAuthorityLimit('role-1', 500000, 'user-1', 'user-1')).rejects.toThrow(common_1.ForbiddenException);
        });
        it('should pass when loan amount within limit', async () => {
            redis.get.mockResolvedValue(null);
            repository.findActiveByRoleId.mockResolvedValue([mockRule]);
            await expect(service.checkAuthorityLimit('role-1', 500000, 'user-1', 'user-2')).resolves.toBeUndefined();
        });
        it('should throw when loan amount exceeds max_loan_amount', async () => {
            redis.get.mockResolvedValue(null);
            repository.findActiveByRoleId.mockResolvedValue([mockRule]);
            await expect(service.checkAuthorityLimit('role-1', 2000000, 'user-1', 'user-2')).rejects.toThrow(common_1.ForbiddenException);
        });
        it('should throw when no authority rule for role', async () => {
            repository.findActiveByRoleId.mockResolvedValue([]);
            redis.get.mockResolvedValue(null);
            await expect(service.checkAuthorityLimit('role-1', 100000)).rejects.toThrow(common_1.ForbiddenException);
        });
    });
    describe('updateAuthorityRule', () => {
        it('should throw NotFoundException when matrix not found', async () => {
            repository.findById.mockResolvedValue(null);
            await expect(service.updateAuthorityRule('missing-id', { max_loan_amount: 2000000 })).rejects.toThrow(common_1.NotFoundException);
        });
    });
});
//# sourceMappingURL=authority.service.spec.js.map