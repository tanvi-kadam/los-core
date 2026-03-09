import { Repository } from 'typeorm';
import { IdempotencyKey } from '../entities/idempotency-key.entity';
export declare class IdempotencyRepository {
    private readonly repo;
    constructor(repo: Repository<IdempotencyKey>);
    findByKey(key: string): Promise<IdempotencyKey | null>;
    save(entity: Partial<IdempotencyKey>): Promise<IdempotencyKey>;
    deleteExpired(before: Date): Promise<void>;
}
