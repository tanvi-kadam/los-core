import { Repository } from 'typeorm';
import { Application } from '../entities/application.entity';
export declare class ApplicationRepository {
    private readonly repo;
    constructor(repo: Repository<Application>);
    save(entity: Partial<Application>): Promise<Application>;
    findById(id: string): Promise<Application | null>;
    findDuplicateByPanAndProduct(pan: string, productCode: string, excludeId?: string): Promise<Application | null>;
    findDuplicatesForDetection(pan: string, entityIdentifier: string, excludeId?: string): Promise<Application[]>;
    findPaged(options: {
        state?: string;
        page: number;
        limit: number;
    }): Promise<{
        items: Application[];
        total: number;
    }>;
}
