import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { AuditRepository } from './repositories/audit.repository';
import { RecordAuditDto } from './dto/record-audit.dto';

@Injectable()
export class AuditService {
  constructor(private readonly repository: AuditRepository) {}

  /**
   * Record an audit event. Call this from every module for significant actions.
   * Pass manager to run inside a transaction.
   */
  async record(dto: RecordAuditDto, manager?: EntityManager): Promise<void> {
    const occurredAt = new Date();
    const payload = {
      actorId: dto.actorId,
      actorRole: dto.actorRole,
      authoritySnapshot: dto.authoritySnapshot ?? null,
      actionType: dto.actionType,
      objectType: dto.objectType,
      objectId: dto.objectId ?? null,
      beforeStateHash: dto.beforeStateHash ?? null,
      afterStateHash: dto.afterStateHash ?? null,
      occurredAt,
      correlationId: dto.correlationId ?? null,
    };
    if (manager) {
      await this.repository.insertWithManager(payload, manager);
    } else {
      await this.repository.insert(payload);
    }
  }
}
