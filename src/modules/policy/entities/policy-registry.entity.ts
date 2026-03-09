import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ schema: 'policy_schema', name: 'policy_registry' })
export class PolicyRegistry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'policy_type', type: 'varchar', length: 100 })
  policyType: string;

  @Column({ type: 'integer', default: 1 })
  version: number;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'effective_from', type: 'timestamp' })
  effectiveFrom: Date;

  @Column({ name: 'approved_by', type: 'uuid', nullable: true })
  approvedBy: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
