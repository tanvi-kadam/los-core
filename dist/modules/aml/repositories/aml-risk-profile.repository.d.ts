import { Repository } from 'typeorm';
import { AmlRiskProfile } from '../entities/aml-risk-profile.entity';
export declare class AmlRiskProfileRepository {
    private readonly repo;
    constructor(repo: Repository<AmlRiskProfile>);
    save(entity: Partial<AmlRiskProfile>): Promise<AmlRiskProfile>;
}
