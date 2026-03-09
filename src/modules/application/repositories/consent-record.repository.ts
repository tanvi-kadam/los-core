import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConsentRecord } from '../entities/consent-record.entity';

@Injectable()
export class ConsentRecordRepository {
  constructor(
    @InjectRepository(ConsentRecord)
    private readonly repo: Repository<ConsentRecord>,
  ) {}

  async save(entity: Partial<ConsentRecord>): Promise<ConsentRecord> {
    const created = this.repo.create(entity);
    return this.repo.save(created);
  }

  async findByApplication(applicationId: string): Promise<ConsentRecord[]> {
    return this.repo.find({
      where: { applicationId },
      order: { createdAt: 'DESC' },
    });
  }
}
