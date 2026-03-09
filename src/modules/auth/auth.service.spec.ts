import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UserRepository } from './repositories/user.repository';
import { UserRoleRepository } from './repositories/user-role.repository';
import { RedisService } from '../../infrastructure/redis';

jest.mock('bcrypt', () => ({ compare: jest.fn() }));

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<UserRepository>;
  let userRoleRepository: jest.Mocked<UserRoleRepository>;
  let jwtService: jest.Mocked<JwtService>;
  let redis: jest.Mocked<RedisService>;

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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
            findById: jest.fn(),
            findByIdWithRoles: jest.fn(),
          },
        },
        {
          provide: UserRoleRepository,
          useValue: {
            findPrimaryRoleByUserId: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-token'),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn((key: string) => (key === 'JWT_ACCESS_EXPIRY' ? '15m' : key === 'JWT_REFRESH_EXPIRY' ? '7d' : 'secret')) },
        },
        {
          provide: RedisService,
          useValue: { setWithTTL: jest.fn(), get: jest.fn() },
        },
        {
          provide: PinoLogger,
          useValue: { setContext: jest.fn(), info: jest.fn(), warn: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(AuthService);
    userRepository = module.get(UserRepository) as jest.Mocked<UserRepository>;
    userRoleRepository = module.get(UserRoleRepository) as jest.Mocked<UserRoleRepository>;
    jwtService = module.get(JwtService) as jest.Mocked<JwtService>;
    redis = module.get(RedisService) as jest.Mocked<RedisService>;
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return tokens on login success', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      userRoleRepository.findPrimaryRoleByUserId.mockResolvedValue(mockUserRole as any);

      const result = await service.login({ email: 'user@los.com', password: 'password' });

      expect(result.access_token).toBe('mock-token');
      expect(result.refresh_token).toBe('mock-token');
      expect(result.expires_in).toBeDefined();
      expect(userRepository.findByEmail).toHaveBeenCalledWith('user@los.com');
      expect(redis.setWithTTL).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException on login failure - user not found', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'unknown@los.com', password: 'password' }),
      ).rejects.toThrow(UnauthorizedException);

      expect(userRepository.findByEmail).toHaveBeenCalledWith('unknown@los.com');
    });

    it('should throw UnauthorizedException on login failure - invalid password', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: 'user@los.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getMe', () => {
    it('should return current user when not cached', async () => {
      redis.get.mockResolvedValue(null);
      userRepository.findByIdWithRoles.mockResolvedValue(mockUser as any);
      userRoleRepository.findPrimaryRoleByUserId.mockResolvedValue(mockUserRole as any);

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
