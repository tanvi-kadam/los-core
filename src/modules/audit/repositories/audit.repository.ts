import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
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

  /**
   * Same as insert but using the given EntityManager (for use inside a transaction).
   */
  async insertWithManager(
    entity: Partial<AuditLog>,
    manager: EntityManager,
  ): Promise<void> {
    await manager
      .getRepository(AuditLog)
      .insert(entity as Parameters<Repository<AuditLog>['insert']>[0]);
  }
}
