import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity({ schema: 'integration_schema', name: 'entity_snapshots' })
export class EntitySnapshot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'application_id', type: 'uuid' })
  applicationId: string;

  @Column({ name: 'mca_reference_id', type: 'varchar', length: 100, nullable: true })
  mcaReferenceId: string | null;

  @Column({ name: 'legal_name', type: 'varchar', length: 255, nullable: true })
  legalName: string | null;

  @Column({ name: 'registration_number', type: 'varchar', length: 100, nullable: true })
  registrationNumber: string | null;

  @Column({ name: 'incorporation_date', type: 'date', nullable: true })
  incorporationDate: Date | null;

  @Column({ name: 'company_status', type: 'varchar', length: 50, nullable: true })
  companyStatus: string | null;

  @Column({ name: 'company_type', type: 'varchar', length: 100, nullable: true })
  companyType: string | null;

  @Column({ name: 'registered_address', type: 'text', nullable: true })
  registeredAddress: string | null;

  @Column({ name: 'snapshot_version', type: 'integer', default: 1 })
  snapshotVersion: number;

  @Column({ name: 'pulled_at', type: 'timestamp' })
  pulledAt: Date;

  @Column({ name: 'raw_response', type: 'jsonb', nullable: true })
  rawResponse: Record<string, unknown> | null;
}
