import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Application } from './application.entity';

@Entity({ schema: 'application_schema', name: 'duplicate_checks' })
export class DuplicateCheck {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'application_id', type: 'uuid' })
  applicationId: string;

  @Column({ name: 'check_type', type: 'varchar', length: 50 })
  checkType: string;

  @Column({ name: 'duplicate_flag', type: 'boolean', default: false })
  duplicateFlag: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Application, (a) => a.duplicateChecks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'application_id' })
  application: Application;
}
