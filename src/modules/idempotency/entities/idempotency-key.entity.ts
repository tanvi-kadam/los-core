import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ schema: 'idempotency_schema', name: 'idempotency_keys' })
export class IdempotencyKey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'idempotency_key', type: 'varchar', length: 255 })
  idempotencyKey: string;

  @Column({ type: 'varchar', length: 255 })
  endpoint: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string | null;

  @Column({ name: 'request_hash', type: 'varchar', length: 255 })
  requestHash: string;

  @Column({ name: 'response_snapshot', type: 'jsonb' })
  responseSnapshot: Record<string, unknown>;

  @Column({ type: 'varchar', length: 20, default: 'COMPLETED' })
  status: string;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
