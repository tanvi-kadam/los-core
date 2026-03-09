import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ schema: 'config_schema', name: 'configurations' })
export class Configuration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'config_type', type: 'varchar', length: 100 })
  configType: string;

  @Column({ name: 'config_key', type: 'varchar', length: 100 })
  configKey: string;

  @Column({ name: 'config_value', type: 'jsonb' })
  configValue: Record<string, unknown>;

  @Column({ type: 'integer', default: 1 })
  version: number;

  @Column({ name: 'effective_from', type: 'timestamp' })
  effectiveFrom: Date;

  @Column({ name: 'approved_by', type: 'uuid', nullable: true })
  approvedBy: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
