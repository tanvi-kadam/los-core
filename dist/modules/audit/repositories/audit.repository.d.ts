import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';
export declare class AuditRepository {
    private readonly repo;
    constructor(repo: Repository<AuditLog>);
    save(entity: Partial<AuditLog>): Promise<AuditLog>;
}
