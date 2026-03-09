import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationStateTransition } from '../entities/application-state-transition.entity';

@Injectable()
export class WorkflowRepository {
  constructor(
    @InjectRepository(ApplicationStateTransition)
    private readonly repo: Repository<ApplicationStateTransition>,
  ) {}

  async save(entity: Partial<ApplicationStateTransition>): Promise<ApplicationStateTransition> {
    const created = this.repo.create(entity);
    return this.repo.save(created);
  }
}
