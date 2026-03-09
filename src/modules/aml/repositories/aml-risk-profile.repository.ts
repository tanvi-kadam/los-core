import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AmlRiskProfile } from '../entities/aml-risk-profile.entity';

@Injectable()
export class AmlRiskProfileRepository {
  constructor(
    @InjectRepository(AmlRiskProfile)
    private readonly repo: Repository<AmlRiskProfile>,
  ) {}

  async save(entity: Partial<AmlRiskProfile>): Promise<AmlRiskProfile> {
    const created = this.repo.create(entity);
    return this.repo.save(created);
  }
}
