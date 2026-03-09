import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { IdempotencyKey } from '../entities/idempotency-key.entity';

@Injectable()
export class IdempotencyRepository {
  constructor(
    @InjectRepository(IdempotencyKey)
    private readonly repo: Repository<IdempotencyKey>,
  ) {}

  async findByKey(key: string): Promise<IdempotencyKey | null> {
    return this.repo.findOne({
      where: { idempotencyKey: key },
      order: { createdAt: 'DESC' },
    });
  }

  async save(entity: Partial<IdempotencyKey>): Promise<IdempotencyKey> {
    const created = this.repo.create(entity);
    return this.repo.save(created);
  }

  async deleteExpired(before: Date): Promise<void> {
    await this.repo.delete({ expiresAt: LessThan(before) });
  }
}
