import { Repository } from 'typeorm';
import { ApprovalRequest } from '../entities/approval-request.entity';
export declare class ApprovalRequestRepository {
    private readonly repo;
    constructor(repo: Repository<ApprovalRequest>);
    save(entity: Partial<ApprovalRequest>): Promise<ApprovalRequest>;
    findById(id: string): Promise<ApprovalRequest | null>;
}
