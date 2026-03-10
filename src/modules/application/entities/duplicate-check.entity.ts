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

  @Column({ name: 'matched_application_id', type: 'uuid', nullable: true })
  matchedApplicationId: string | null;

  @Column({
    name: 'match_reason',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  matchReason: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Application, (a) => a.duplicateChecks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'application_id' })
  application: Application;
}
