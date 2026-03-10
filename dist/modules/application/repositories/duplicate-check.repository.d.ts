import { Repository } from 'typeorm';
import { DuplicateCheck } from '../entities/duplicate-check.entity';
export declare class DuplicateCheckRepository {
    private readonly repo;
    constructor(repo: Repository<DuplicateCheck>);
    save(entity: Partial<DuplicateCheck>): Promise<DuplicateCheck>;
    findByApplicationId(applicationId: string): Promise<DuplicateCheck[]>;
}
