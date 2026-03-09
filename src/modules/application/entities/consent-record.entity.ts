import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Application } from './application.entity';
import { ConsentType } from './consent-type.entity';

@Entity({ schema: 'application_schema', name: 'consent_records' })
export class ConsentRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'application_id', type: 'uuid' })
  applicationId: string;

  @Column({ name: 'consent_type_id', type: 'uuid' })
  consentTypeId: string;

  @Column({ name: 'consented_at', type: 'timestamp' })
  consentedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Application, (a) => a.consentRecords, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'application_id' })
  application: Application;

  @ManyToOne(() => ConsentType)
  @JoinColumn({ name: 'consent_type_id' })
  consentType: ConsentType;
}
