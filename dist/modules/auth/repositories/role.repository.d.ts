import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
export declare class RoleRepository {
    private readonly repo;
    constructor(repo: Repository<Role>);
    findById(id: string): Promise<Role | null>;
    findByName(name: string): Promise<Role | null>;
}
