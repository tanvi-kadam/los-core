import { Injectable, ConflictException } from '@nestjs/common';
import { IdempotencyRepository } from './repositories/idempotency.repository';
import { IdempotencyKey } from './entities/idempotency-key.entity';

const IDEMPOTENCY_TTL_HOURS = 24;

@Injectable()
export class IdempotencyService {
  constructor(private readonly repository: IdempotencyRepository) {}

  /**
   * Check idempotency key: if exists with same request_hash return stored response;
   * if exists with different request_hash throw 409.
   */
  async check(
    key: string,
    endpoint: string,
    requestHash: string,
    userId: string | null,
  ): Promise<Record<string, unknown> | null> {
    const record = await this.repository.findByKeyAndEndpoint(key, endpoint);
    if (!record) return null;
    if (record.requestHash !== requestHash) {
      throw new ConflictException(
        'Idempotency key already used with a different request body',
      );
    }
    if (new Date() > record.expiresAt) return null;
    return record.responseSnapshot as Record<string, unknown>;
  }

  async getStoredResponse(key: string): Promise<Record<string, unknown> | null> {
    const record = await this.repository.findByKey(key);
    if (!record || new Date() > record.expiresAt) return null;
    return record.responseSnapshot as Record<string, unknown>;
  }

  async store(
    key: string,
    endpoint: string,
    userId: string | null,
    requestHash: string,
    responseSnapshot: Record<string, unknown>,
    status = 'COMPLETED',
  ): Promise<IdempotencyKey> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + IDEMPOTENCY_TTL_HOURS);
    return this.repository.save({
      idempotencyKey: key,
      endpoint,
      userId,
      requestHash,
      responseSnapshot,
      status,
      expiresAt,
    });
  }
}
