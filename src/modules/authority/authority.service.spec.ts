import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { AuthorityService } from './authority.service';
import { AuthorityRepository } from './repositories/authority.repository';
import { RedisService } from '../../infrastructure/redis';

describe('AuthorityService', () => {
  let service: AuthorityService;
  let repository: jest.Mocked<AuthorityRepository>;
  let redis: jest.Mocked<RedisService>;

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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorityService,
        {
          provide: AuthorityRepository,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            findById: jest.fn(),
            findActiveByRoleId: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: { get: jest.fn(), setWithTTL: jest.fn(), delete: jest.fn() },
        },
        {
          provide: PinoLogger,
          useValue: { setContext: jest.fn(), warn: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(AuthorityService);
    repository = module.get(AuthorityRepository) as jest.Mocked<AuthorityRepository>;
    redis = module.get(RedisService) as jest.Mocked<RedisService>;
    jest.clearAllMocks();
  });

  describe('checkAuthorityLimit', () => {
    it('should throw when maker_id equals checker_id', async () => {
      redis.get.mockResolvedValue(null);
      repository.findActiveByRoleId.mockResolvedValue([mockRule as any]);

      await expect(
        service.checkAuthorityLimit('role-1', 500000, 'user-1', 'user-1'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should pass when loan amount within limit', async () => {
      redis.get.mockResolvedValue(null);
      repository.findActiveByRoleId.mockResolvedValue([mockRule as any]);

      await expect(
        service.checkAuthorityLimit('role-1', 500000, 'user-1', 'user-2'),
      ).resolves.toBeUndefined();
    });

    it('should throw when loan amount exceeds max_loan_amount', async () => {
      redis.get.mockResolvedValue(null);
      repository.findActiveByRoleId.mockResolvedValue([mockRule as any]);

      await expect(
        service.checkAuthorityLimit('role-1', 2000000, 'user-1', 'user-2'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw when no authority rule for role', async () => {
      repository.findActiveByRoleId.mockResolvedValue([]);
      redis.get.mockResolvedValue(null);

      await expect(
        service.checkAuthorityLimit('role-1', 100000),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('updateAuthorityRule', () => {
    it('should throw NotFoundException when matrix not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.updateAuthorityRule('missing-id', { max_loan_amount: 2000000 }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
