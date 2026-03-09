import { Injectable } from '@nestjs/common';
import { ConfigRepository } from './repositories/config.repository';
import { CreateConfigDto } from './dto/create-config.dto';

@Injectable()
export class ConfigService {
  constructor(private readonly repository: ConfigRepository) {}

  async create(dto: CreateConfigDto): Promise<{ id: string; configType: string; configKey: string; version: number }> {
    const effectiveFrom = dto.effectiveFrom ? new Date(dto.effectiveFrom) : new Date();
    const existing = await this.repository.findByType(dto.configType, effectiveFrom);
    const nextVersion = existing.length > 0 ? (existing[0].version ?? 1) + 1 : 1;
    const created = await this.repository.save({
      configType: dto.configType,
      configKey: dto.configKey,
      configValue: dto.configValue,
      version: nextVersion,
      effectiveFrom,
      approvedBy: dto.approvedBy ?? null,
    });
    return {
      id: created.id,
      configType: created.configType,
      configKey: created.configKey,
      version: created.version,
    };
  }

  async getByType(configType: string): Promise<Record<string, unknown>[]> {
    const rows = await this.repository.findByType(configType);
    return rows.map((r) => ({
      id: r.id,
      config_type: r.configType,
      config_key: r.configKey,
      config_value: r.configValue,
      version: r.version,
      effective_from: r.effectiveFrom,
      approved_by: r.approvedBy,
      created_at: r.createdAt,
    }));
  }
}
