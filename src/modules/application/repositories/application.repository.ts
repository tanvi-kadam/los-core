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
}
