import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ schema: 'config_schema', name: 'consent_types' })
export class ConsentType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'consent_code', type: 'varchar', length: 50, unique: true })
  consentCode: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'version', type: 'integer', default: 1 })
  version: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
