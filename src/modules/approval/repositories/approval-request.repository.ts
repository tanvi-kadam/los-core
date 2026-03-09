import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApprovalRequest } from '../entities/approval-request.entity';

@Injectable()
export class ApprovalRequestRepository {
  constructor(
    @InjectRepository(ApprovalRequest)
    private readonly repo: Repository<ApprovalRequest>,
  ) {}

  async save(entity: Partial<ApprovalRequest>): Promise<ApprovalRequest> {
    const created = this.repo.create(entity);
    return this.repo.save(created);
  }

  async findById(id: string): Promise<ApprovalRequest | null> {
    return this.repo.findOne({ where: { id } });
  }
}
