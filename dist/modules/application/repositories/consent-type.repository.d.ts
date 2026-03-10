import { Repository } from 'typeorm';
import { ConsentType } from '../entities/consent-type.entity';
export declare class ConsentTypeRepository {
    private readonly repo;
    constructor(repo: Repository<ConsentType>);
    findById(id: string): Promise<ConsentType | null>;
    findActiveByCode(consentCode: string): Promise<ConsentType | null>;
    findAllActive(): Promise<ConsentType[]>;
}
