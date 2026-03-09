import { Repository } from 'typeorm';
import { ConsentType } from '../entities/consent-type.entity';
export declare class ConsentTypeRepository {
    private readonly repo;
    constructor(repo: Repository<ConsentType>);
    findById(id: string): Promise<ConsentType | null>;
}
