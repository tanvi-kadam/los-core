import { Injectable } from '@nestjs/common';
import { PolicyRepository } from './repositories/policy.repository';
import { CreatePolicyDto } from './dto/create-policy.dto';

@Injectable()
export class PolicyService {
  constructor(private readonly repository: PolicyRepository) {}

  async create(dto: CreatePolicyDto): Promise<{ id: string; policyType: string; version: number }> {
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

  async getAll(): Promise<
    { id: string; policyType: string; version: number; description: string | null; effectiveFrom: Date; approvedBy: string | null; createdAt: Date }[]
  > {
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
}
