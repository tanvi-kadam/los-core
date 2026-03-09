import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntitySnapshot } from '../entities/entity-snapshot.entity';

@Injectable()
export class EntitySnapshotRepository {
  constructor(
    @InjectRepository(EntitySnapshot)
    private readonly repo: Repository<EntitySnapshot>,
  ) {}

  async save(entity: Partial<EntitySnapshot>): Promise<EntitySnapshot> {
    const created = this.repo.create(entity);
    return this.repo.save(created);
  }

  async findLatestByApplication(applicationId: string): Promise<EntitySnapshot | null> {
    return this.repo.findOne({
      where: { applicationId },
      order: { snapshotVersion: 'DESC' },
    });
  }
}
