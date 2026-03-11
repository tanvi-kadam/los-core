import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from '../entities/application.entity';

@Injectable()
export class ApplicationRepository {
  constructor(
    @InjectRepository(Application)
    private readonly repo: Repository<Application>,
  ) {}

  async save(entity: Partial<Application>): Promise<Application> {
    const created = this.repo.create(entity);
    return this.repo.save(created);
  }

  async findById(id: string): Promise<Application | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findDuplicateByPanAndProduct(pan: string, productCode: string, excludeId?: string): Promise<Application | null> {
    const qb = this.repo
      .createQueryBuilder('a')
      .where('a.pan = :pan', { pan })
      .andWhere('a.product_code = :productCode', { productCode });
    if (excludeId) qb.andWhere('a.id != :excludeId', { excludeId });
    return qb.getOne();
  }

  async findDuplicatesForDetection(
    pan: string,
    entityIdentifier: string,
    excludeId?: string,
  ): Promise<Application[]> {
    const qb = this.repo
      .createQueryBuilder('a')
      .where('a.pan = :pan OR a.entity_identifier = :entityIdentifier', {
        pan,
        entityIdentifier,
      });
    if (excludeId) {
      qb.andWhere('a.id != :excludeId', { excludeId });
    }
    return qb.getMany();
  }

  async findPaged(options: {
    state?: string;
    page: number;
    limit: number;
  }): Promise<{ items: Application[]; total: number }> {
    const qb = this.repo.createQueryBuilder('a');

    if (options.state) {
      qb.where('a.current_state = :state', { state: options.state });
    }

    qb.orderBy('a.created_at', 'DESC');

    qb.skip((options.page - 1) * options.limit).take(options.limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total };
  }
}
