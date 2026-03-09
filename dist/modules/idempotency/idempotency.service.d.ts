import { IdempotencyRepository } from './repositories/idempotency.repository';
import { IdempotencyKey } from './entities/idempotency-key.entity';
export declare class IdempotencyService {
    private readonly repository;
    constructor(repository: IdempotencyRepository);
    check(key: string, endpoint: string, requestHash: string, userId: string | null): Promise<Record<string, unknown> | null>;
    getStoredResponse(key: string): Promise<Record<string, unknown> | null>;
    store(key: string, endpoint: string, userId: string | null, requestHash: string, responseSnapshot: Record<string, unknown>, status?: string): Promise<IdempotencyKey>;
}
