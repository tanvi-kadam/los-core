import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email: email.toLowerCase(), status: 'ACTIVE' } });
  }

  async findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id, status: 'ACTIVE' } });
  }

  async findByIdWithRoles(id: string): Promise<User | null> {
    return this.repo.findOne({
      where: { id, status: 'ACTIVE' },
      relations: ['userRoles', 'userRoles.role'],
    });
  }
}
