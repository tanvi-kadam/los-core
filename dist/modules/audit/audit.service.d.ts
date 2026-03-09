import { AuditRepository } from './repositories/audit.repository';
import { RecordAuditDto } from './dto/record-audit.dto';
export declare class AuditService {
    private readonly repository;
    constructor(repository: AuditRepository);
    record(dto: RecordAuditDto): Promise<void>;
}
