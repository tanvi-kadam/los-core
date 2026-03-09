import { Repository } from 'typeorm';
import { PolicyRegistry } from '../entities/policy-registry.entity';
export declare class PolicyRepository {
    private readonly repo;
    constructor(repo: Repository<PolicyRegistry>);
    save(entity: Partial<PolicyRegistry>): Promise<PolicyRegistry>;
    findAll(): Promise<PolicyRegistry[]>;
    findByType(policyType: string): Promise<PolicyRegistry[]>;
}
