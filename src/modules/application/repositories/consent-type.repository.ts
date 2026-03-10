import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConsentType } from '../entities/consent-type.entity';

@Injectable()
export class ConsentTypeRepository {
  constructor(
    @InjectRepository(ConsentType)
    private readonly repo: Repository<ConsentType>,
  ) {}

  async findById(id: string): Promise<ConsentType | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findActiveByCode(consentCode: string): Promise<ConsentType | null> {
    return this.repo.findOne({
      where: { consentCode, isActive: true },
    });
  }

  async findAllActive(): Promise<ConsentType[]> {
    return this.repo.find({
      where: { isActive: true },
      order: { consentCode: 'ASC' },
    });
  }
}
