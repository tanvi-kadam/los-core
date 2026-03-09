import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity({ schema: 'audit_schema', name: 'audit_logs' })
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'actor_id', type: 'uuid' })
  actorId: string;

  @Column({ name: 'actor_role', type: 'varchar', length: 100 })
  actorRole: string;

  @Column({ name: 'authority_snapshot', type: 'jsonb', nullable: true })
  authoritySnapshot: Record<string, unknown> | null;

  @Column({ name: 'action_type', type: 'varchar', length: 100 })
  actionType: string;

  @Column({ name: 'object_type', type: 'varchar', length: 50 })
  objectType: string;

  @Column({ name: 'object_id', type: 'uuid', nullable: true })
  objectId: string | null;

  @Column({ name: 'before_state_hash', type: 'varchar', length: 255, nullable: true })
  beforeStateHash: string | null;

  @Column({ name: 'after_state_hash', type: 'varchar', length: 255, nullable: true })
  afterStateHash: string | null;

  @Column({ name: 'occurred_at', type: 'timestamp' })
  occurredAt: Date;

  @Column({ name: 'correlation_id', type: 'uuid', nullable: true })
  correlationId: string | null;
}
