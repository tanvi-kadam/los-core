import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { RedisService } from '../../infrastructure/redis';
import { AuthorityRepository } from './repositories/authority.repository';
import { AuthorityMatrix } from './entities/authority-matrix.entity';
import { CreateAuthorityDto } from './dto/create-authority.dto';
import { UpdateAuthorityDto } from './dto/update-authority.dto';

const AUTHORITY_CACHE_PREFIX = 'AUTHORITY:';
const AUTHORITY_CACHE_TTL_SECONDS = 600; // 10 minutes

export interface AuthorityRuleDto {
  id: string;
  role_id: string;
  max_loan_amount: string;
  max_deviation_percent: string | null;
  allowed_products: string[] | null;
  allowed_geographies: string[] | null;
  effective_from: string;
  effective_to: string | null;
}

@Injectable()
export class AuthorityService {
  constructor(
    private readonly authorityRepository: AuthorityRepository,
    private readonly redis: RedisService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AuthorityService.name);
  }

  async createAuthorityRule(dto: CreateAuthorityDto): Promise<AuthorityRuleDto> {
    const entity = await this.authorityRepository.create({
      roleId: dto.role_id,
      maxLoanAmount: String(dto.max_loan_amount),
      maxDeviationPercent: dto.max_deviation_percent != null ? String(dto.max_deviation_percent) : null,
      allowedProducts: dto.allowed_products ?? null,
      allowedGeographies: dto.allowed_geographies ?? null,
      effectiveFrom: new Date(dto.effective_from),
      effectiveTo: dto.effective_to ? new Date(dto.effective_to) : null,
    });
    await this.invalidateAuthorityCache(dto.role_id);
    return this.toDto(entity);
  }

  async updateAuthorityRule(id: string, dto: UpdateAuthorityDto): Promise<AuthorityRuleDto> {
    const existing = await this.authorityRepository.findById(id);
    if (!existing) throw new NotFoundException('Authority matrix not found');
    const entity = await this.authorityRepository.update(id, {
      ...(dto.role_id != null && { roleId: dto.role_id }),
      ...(dto.max_loan_amount != null && { maxLoanAmount: String(dto.max_loan_amount) }),
      ...(dto.max_deviation_percent != null && { maxDeviationPercent: String(dto.max_deviation_percent) }),
      ...(dto.allowed_products !== undefined && { allowedProducts: dto.allowed_products }),
      ...(dto.allowed_geographies !== undefined && { allowedGeographies: dto.allowed_geographies }),
      ...(dto.effective_from != null && { effectiveFrom: new Date(dto.effective_from) }),
      ...(dto.effective_to !== undefined && { effectiveTo: dto.effective_to ? new Date(dto.effective_to) : null }),
    });
    await this.invalidateAuthorityCache(existing.roleId);
    if (entity.roleId !== existing.roleId) await this.invalidateAuthorityCache(entity.roleId);
    return this.toDto(entity);
  }

  async getAuthorityForRole(roleId: string): Promise<AuthorityRuleDto[]> {
    const cached = await this.getAuthorityCache(roleId);
    if (cached) return cached;
    const list = await this.authorityRepository.findActiveByRoleId(roleId);
    const dtos = list.map((e) => this.toDto(e));
    await this.setAuthorityCache(roleId, dtos);
    return dtos;
  }

  /**
   * Validates that the given loan amount is within the role's authority limit.
   * maker_id must not equal checker_id (maker-checker rule).
   */
  async checkAuthorityLimit(
    roleId: string,
    loanAmount: number,
    makerId?: string,
    checkerId?: string,
  ): Promise<void> {
    if (makerId && checkerId && makerId === checkerId) {
      this.logger.warn({ makerId, checkerId }, 'maker_id must not equal checker_id');
      throw new ForbiddenException('Maker and checker must be different');
    }
    const rules = await this.getAuthorityForRole(roleId);
    if (rules.length === 0) {
      throw new ForbiddenException('No authority rule found for role');
    }
    const maxAmount = rules.reduce((max, r) => Math.max(max, parseFloat(r.max_loan_amount)), 0);
    if (loanAmount > maxAmount) {
      this.logger.warn({ roleId, loanAmount, maxAmount }, 'authority limit exceeded');
      throw new ForbiddenException(`Loan amount exceeds authority limit (max: ${maxAmount})`);
    }
  }

  private async getAuthorityCache(roleId: string): Promise<AuthorityRuleDto[] | null> {
    const raw = await this.redis.get(`${AUTHORITY_CACHE_PREFIX}${roleId}`);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthorityRuleDto[];
    } catch {
      return null;
    }
  }

  private async setAuthorityCache(roleId: string, rules: AuthorityRuleDto[]): Promise<void> {
    await this.redis.setWithTTL(
      `${AUTHORITY_CACHE_PREFIX}${roleId}`,
      JSON.stringify(rules),
      AUTHORITY_CACHE_TTL_SECONDS,
    );
  }

  private async invalidateAuthorityCache(roleId: string): Promise<void> {
    await this.redis.delete(`${AUTHORITY_CACHE_PREFIX}${roleId}`);
  }

  private toDto(e: AuthorityMatrix): AuthorityRuleDto {
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
}
