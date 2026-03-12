import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';

@Injectable()
export class AuditRepository {
  constructor(
    @InjectRepository(AuditLog)
    private readonly repo: Repository<AuditLog>,
  ) {}

  /**
   * Append-only: inserts a new audit log row. No update or delete.
   */
  async insert(entity: Partial<AuditLog>): Promise<void> {
    await this.repo.insert(entity as Parameters<Repository<AuditLog>['insert']>[0]);
  }
}
