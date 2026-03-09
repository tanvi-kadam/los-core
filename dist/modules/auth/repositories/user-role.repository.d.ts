import { Repository } from 'typeorm';
import { UserRole } from '../entities/user-role.entity';
export declare class UserRoleRepository {
    private readonly repo;
    constructor(repo: Repository<UserRole>);
    findPrimaryRoleByUserId(userId: string): Promise<UserRole | null>;
    findRolesByUserId(userId: string): Promise<UserRole[]>;
}
