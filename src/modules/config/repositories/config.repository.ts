import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Configuration } from '../entities/configuration.entity';

@Injectable()
export class ConfigRepository {
  constructor(
    @InjectRepository(Configuration)
    private readonly repo: Repository<Configuration>,
  ) {}

  async findByType(configType: string, asOf = new Date()): Promise<Configuration[]> {
    return this.repo.find({
      where: {
        configType,
        effectiveFrom: LessThanOrEqual(asOf),
      },
      order: { effectiveFrom: 'DESC', version: 'DESC' },
    });
  }

  async save(entity: Partial<Configuration>): Promise<Configuration> {
    const created = this.repo.create(entity);
    return this.repo.save(created);
  }
}
