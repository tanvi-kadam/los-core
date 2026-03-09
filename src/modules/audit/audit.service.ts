import { Injectable } from '@nestjs/common';
import { AuditRepository } from './repositories/audit.repository';
import { RecordAuditDto } from './dto/record-audit.dto';

@Injectable()
export class AuditService {
  constructor(private readonly repository: AuditRepository) {}

  /**
   * Record an audit event. Call this from every module for significant actions.
   */
  async record(dto: RecordAuditDto): Promise<void> {
    const occurredAt = new Date();
    await this.repository.save({
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
    });
  }
}
