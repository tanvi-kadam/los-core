import { PolicyRepository } from './repositories/policy.repository';
import { CreatePolicyDto } from './dto/create-policy.dto';
export declare class PolicyService {
    private readonly repository;
    constructor(repository: PolicyRepository);
    create(dto: CreatePolicyDto): Promise<{
        id: string;
        policyType: string;
        version: number;
    }>;
    getAll(): Promise<{
        id: string;
        policyType: string;
        version: number;
        description: string | null;
        effectiveFrom: Date;
        approvedBy: string | null;
        createdAt: Date;
    }[]>;
}
