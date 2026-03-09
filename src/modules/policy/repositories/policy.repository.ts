import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PolicyRegistry } from '../entities/policy-registry.entity';

@Injectable()
export class PolicyRepository {
  constructor(
    @InjectRepository(PolicyRegistry)
    private readonly repo: Repository<PolicyRegistry>,
  ) {}

  async save(entity: Partial<PolicyRegistry>): Promise<PolicyRegistry> {
    const created = this.repo.create(entity);
    return this.repo.save(created);
  }

  async findAll(): Promise<PolicyRegistry[]> {
    return this.repo.find({ order: { policyType: 'ASC', version: 'DESC' } });
  }

  async findByType(policyType: string): Promise<PolicyRegistry[]> {
    return this.repo.find({
      where: { policyType },
      order: { version: 'DESC' },
    });
  }
}
