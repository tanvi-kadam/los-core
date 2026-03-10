import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DuplicateCheck } from '../entities/duplicate-check.entity';

@Injectable()
export class DuplicateCheckRepository {
  constructor(
    @InjectRepository(DuplicateCheck)
    private readonly repo: Repository<DuplicateCheck>,
  ) {}

  async save(entity: Partial<DuplicateCheck>): Promise<DuplicateCheck> {
    const created = this.repo.create(entity);
    return this.repo.save(created);
  }

  async findByApplicationId(applicationId: string): Promise<DuplicateCheck[]> {
    return this.repo.find({ where: { applicationId } });
  }
}
