import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PinoLogger } from 'nestjs-pino';
import { UserRepository } from './repositories/user.repository';
import { UserRoleRepository } from './repositories/user-role.repository';
import { RedisService } from '../../infrastructure/redis';
import { LoginDto } from './dto/login.dto';

const AUTH_CACHE_PREFIX = 'AUTH:';
const AUTH_CACHE_TTL_SECONDS = 300; // 5 minutes

export interface JwtPayload {
  sub: string;
  email: string;
  role_id: string;
  type: 'access' | 'refresh';
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface CurrentUserDto {
  user_id: string;
  email: string;
  role_id: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userRoleRepository: UserRoleRepository,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly redis: RedisService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AuthService.name);
  }

  async login(dto: LoginDto, correlationId?: string): Promise<AuthTokens> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      this.logger.warn({ email: dto.email, correlation_id: correlationId }, 'login failure: user not found');
      throw new UnauthorizedException('Invalid email or password');
    }
    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      this.logger.warn({ email: dto.email, user_id: user.id, correlation_id: correlationId }, 'login failure: invalid password');
      throw new UnauthorizedException('Invalid email or password');
    }
    const primaryRole = await this.userRoleRepository.findPrimaryRoleByUserId(user.id);
    const roleId = primaryRole?.role?.id ?? '';
    const payload: Omit<JwtPayload, 'type'> = {
      sub: user.id,
      email: user.email,
      role_id: roleId,
    };
    const accessToken = this.jwtService.sign(
      { ...payload, type: 'access' },
      { expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRY', '15m') },
    );
    const refreshToken = this.jwtService.sign(
      { ...payload, type: 'refresh' },
      { expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRY', '7d') },
    );
    const expiresIn = this.parseExpiryToSeconds(this.config.get<string>('JWT_ACCESS_EXPIRY', '15m'));
    this.logger.info(
      { user_id: user.id, email: user.email, role_id: roleId, correlation_id: correlationId },
      'login success',
    );
    await this.setAuthCache(user.id, { user_id: user.id, email: user.email, role_id: roleId });
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn,
    };
  }

  async refresh(refreshToken: string, correlationId?: string): Promise<AuthTokens> {
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(refreshToken);
    } catch {
      this.logger.warn({ correlation_id: correlationId }, 'token generation failed: invalid refresh token');
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }
    const primaryRole = await this.userRoleRepository.findPrimaryRoleByUserId(user.id);
    const roleId = primaryRole?.role?.id ?? payload.role_id;
    const newPayload: Omit<JwtPayload, 'type'> = {
      sub: user.id,
      email: user.email,
      role_id: roleId,
    };
    const accessToken = this.jwtService.sign(
      { ...newPayload, type: 'access' },
      { expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRY', '15m') },
    );
    const newRefreshToken = this.jwtService.sign(
      { ...newPayload, type: 'refresh' },
      { expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRY', '7d') },
    );
    this.logger.info(
      { user_id: user.id, correlation_id: correlationId },
      'token generation',
    );
    await this.setAuthCache(user.id, { user_id: user.id, email: user.email, role_id: roleId });
    return {
      access_token: accessToken,
      refresh_token: newRefreshToken,
      expires_in: this.parseExpiryToSeconds(this.config.get<string>('JWT_ACCESS_EXPIRY', '15m')),
    };
  }

  async getMe(userId: string): Promise<CurrentUserDto> {
    const cached = await this.getAuthCache(userId);
    if (cached) return cached;
    const user = await this.userRepository.findByIdWithRoles(userId);
    if (!user) throw new UnauthorizedException('User not found');
    const primaryRole = await this.userRoleRepository.findPrimaryRoleByUserId(user.id);
    const roleId = primaryRole?.role?.id ?? '';
    const dto: CurrentUserDto = { user_id: user.id, email: user.email, role_id: roleId };
    await this.setAuthCache(user.id, dto);
    return dto;
  }

  async validatePayload(payload: JwtPayload): Promise<CurrentUserDto | null> {
    if (payload.type !== 'access') return null;
    const cached = await this.getAuthCache(payload.sub);
    if (cached) return cached;
    const user = await this.userRepository.findById(payload.sub);
    if (!user) return null;
    const primaryRole = await this.userRoleRepository.findPrimaryRoleByUserId(user.id);
    const roleId = primaryRole?.role?.id ?? payload.role_id;
    return { user_id: user.id, email: user.email, role_id: roleId };
  }

  private async getAuthCache(userId: string): Promise<CurrentUserDto | null> {
    const raw = await this.redis.get(`${AUTH_CACHE_PREFIX}${userId}`);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as CurrentUserDto;
    } catch {
      return null;
    }
  }

  private async setAuthCache(userId: string, dto: CurrentUserDto): Promise<void> {
    await this.redis.setWithTTL(
      `${AUTH_CACHE_PREFIX}${userId}`,
      JSON.stringify(dto),
      AUTH_CACHE_TTL_SECONDS,
    );
  }

  private parseExpiryToSeconds(expiry: string): number {
    const match = expiry.match(/^(\d+)(m|s|h|d)$/);
    if (!match) return 900;
    const [, num, unit] = match;
    const n = parseInt(num!, 10);
    switch (unit) {
      case 's': return n;
      case 'm': return n * 60;
      case 'h': return n * 3600;
      case 'd': return n * 86400;
      default: return 900;
    }
  }
}
