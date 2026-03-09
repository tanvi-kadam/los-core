import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApprovalRequest } from './approval-request.entity';

@Entity({ schema: 'approval_schema', name: 'approval_decisions' })
export class ApprovalDecision {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'approval_request_id', type: 'uuid' })
  approvalRequestId: string;

  @Column({ name: 'checker_id', type: 'uuid' })
  checkerId: string;

  @Column({ type: 'varchar', length: 20 })
  decision: string;

  @Column({ name: 'authority_snapshot', type: 'jsonb', nullable: true })
  authoritySnapshot: Record<string, unknown> | null;

  @Column({ name: 'decided_at', type: 'timestamp' })
  decidedAt: Date;

  @ManyToOne(() => ApprovalRequest)
  @JoinColumn({ name: 'approval_request_id' })
  approvalRequest: ApprovalRequest;
}
