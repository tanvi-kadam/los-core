import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ schema: 'authority_schema', name: 'authority_matrix' })
export class AuthorityMatrix {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'role_id', type: 'uuid' })
  roleId: string;

  @Column({ name: 'max_loan_amount', type: 'numeric', precision: 18, scale: 2 })
  maxLoanAmount: string;

  @Column({ name: 'max_deviation_percent', type: 'numeric', precision: 5, scale: 2, nullable: true })
  maxDeviationPercent: string | null;

  @Column({ name: 'allowed_products', type: 'jsonb', nullable: true })
  allowedProducts: string[] | null;

  @Column({ name: 'allowed_geographies', type: 'jsonb', nullable: true })
  allowedGeographies: string[] | null;

  @Column({ name: 'effective_from', type: 'timestamp' })
  effectiveFrom: Date;

  @Column({ name: 'effective_to', type: 'timestamp', nullable: true })
  effectiveTo: Date | null;
}
