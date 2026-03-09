import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
export declare class UserRepository {
    private readonly repo;
    constructor(repo: Repository<User>);
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findByIdWithRoles(id: string): Promise<User | null>;
}
