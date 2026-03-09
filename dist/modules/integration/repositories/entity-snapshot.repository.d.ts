import { Repository } from 'typeorm';
import { EntitySnapshot } from '../entities/entity-snapshot.entity';
export declare class EntitySnapshotRepository {
    private readonly repo;
    constructor(repo: Repository<EntitySnapshot>);
    save(entity: Partial<EntitySnapshot>): Promise<EntitySnapshot>;
    findLatestByApplication(applicationId: string): Promise<EntitySnapshot | null>;
}
