import { PolicyService } from './policy.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
export declare class PolicyController {
    private readonly policyService;
    constructor(policyService: PolicyService);
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
