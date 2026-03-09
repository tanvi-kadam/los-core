import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ConsentRecord } from './consent-record.entity';
import { DuplicateCheck } from './duplicate-check.entity';

@Entity({ schema: 'application_schema', name: 'applications' })
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'entity_type', type: 'varchar', length: 50 })
  entityType: string;

  @Column({ name: 'entity_identifier', type: 'varchar', length: 100 })
  entityIdentifier: string;

  @Column({ type: 'varchar', length: 20 })
  pan: string;

  @Column({ name: 'product_code', type: 'varchar', length: 50 })
  productCode: string;

  @Column({ name: 'loan_amount', type: 'numeric', precision: 18, scale: 2 })
  loanAmount: string;

  @Column({ name: 'loan_tenure_months', type: 'integer' })
  loanTenureMonths: number;

  @Column({ type: 'text', nullable: true })
  purpose: string | null;

  @Column({ name: 'current_state', type: 'varchar', length: 50, default: 'DRAFT' })
  currentState: string;

  @Column({ name: 'consent_status', type: 'varchar', length: 20, default: 'PENDING' })
  consentStatus: string;

  @Column({ name: 'duplicate_flag', type: 'boolean', default: false })
  duplicateFlag: boolean;

  @Column({ name: 'created_by', type: 'uuid' })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => ConsentRecord, (c) => c.application)
  consentRecords: ConsentRecord[];

  @OneToMany(() => DuplicateCheck, (d) => d.application)
  duplicateChecks: DuplicateCheck[];
}
