import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity({ schema: 'workflow_schema', name: 'application_state_transitions' })
export class ApplicationStateTransition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'application_id', type: 'uuid' })
  applicationId: string;

  @Column({ name: 'from_state', type: 'varchar', length: 50 })
  fromState: string;

  @Column({ name: 'to_state', type: 'varchar', length: 50 })
  toState: string;

  @Column({ name: 'triggered_by', type: 'uuid' })
  triggeredBy: string;

  @Column({ name: 'triggered_role', type: 'varchar', length: 100 })
  triggeredRole: string;

  @Column({ name: 'authority_snapshot', type: 'jsonb', nullable: true })
  authoritySnapshot: Record<string, unknown> | null;

  @Column({ name: 'occurred_at', type: 'timestamp' })
  occurredAt: Date;

  @Column({ name: 'correlation_id', type: 'uuid', nullable: true })
  correlationId: string | null;
}
