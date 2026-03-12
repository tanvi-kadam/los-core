import { EntityManager, Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';
export declare class AuditRepository {
    private readonly repo;
    constructor(repo: Repository<AuditLog>);
    insert(entity: Partial<AuditLog>): Promise<void>;
    insertWithManager(entity: Partial<AuditLog>, manager: EntityManager): Promise<void>;
}
