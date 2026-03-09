import { Repository } from 'typeorm';
import { ApprovalDecision } from '../entities/approval-decision.entity';
export declare class ApprovalDecisionRepository {
    private readonly repo;
    constructor(repo: Repository<ApprovalDecision>);
    save(entity: Partial<ApprovalDecision>): Promise<ApprovalDecision>;
}
