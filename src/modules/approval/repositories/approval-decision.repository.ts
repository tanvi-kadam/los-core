import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApprovalDecision } from '../entities/approval-decision.entity';

@Injectable()
export class ApprovalDecisionRepository {
  constructor(
    @InjectRepository(ApprovalDecision)
    private readonly repo: Repository<ApprovalDecision>,
  ) {}

  async save(entity: Partial<ApprovalDecision>): Promise<ApprovalDecision> {
    const created = this.repo.create(entity);
    return this.repo.save(created);
  }
}
