import { Repository } from 'typeorm';
import { ConsentRecord } from '../entities/consent-record.entity';
export declare class ConsentRecordRepository {
    private readonly repo;
    constructor(repo: Repository<ConsentRecord>);
    save(entity: Partial<ConsentRecord>): Promise<ConsentRecord>;
    findByApplication(applicationId: string): Promise<ConsentRecord[]>;
}
