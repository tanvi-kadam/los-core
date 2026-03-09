import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../entities/user-role.entity';

@Injectable()
export class UserRoleRepository {
  constructor(
    @InjectRepository(UserRole)
    private readonly repo: Repository<UserRole>,
  ) {}

  async findPrimaryRoleByUserId(userId: string): Promise<UserRole | null> {
    return this.repo.findOne({
      where: { userId },
      relations: ['role'],
      order: { assignedAt: 'DESC' },
    });
  }

  async findRolesByUserId(userId: string): Promise<UserRole[]> {
    return this.repo.find({
      where: { userId },
      relations: ['role'],
    });
  }
}
