import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ schema: 'approval_schema', name: 'approval_requests' })
export class ApprovalRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'object_type', type: 'varchar', length: 50 })
  objectType: string;

  @Column({ name: 'object_id', type: 'uuid' })
  objectId: string;

  @Column({ name: 'action_type', type: 'varchar', length: 100 })
  actionType: string;

  @Column({ name: 'maker_id', type: 'uuid' })
  makerId: string;

  @Column({ type: 'varchar', length: 20, default: 'PENDING' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
