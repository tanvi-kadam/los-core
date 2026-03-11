import { Repository } from "typeorm";
import { AuthorityMatrix } from "../entities/authority-matrix.entity";
export declare class AuthorityRepository {
    private readonly repo;
    constructor(repo: Repository<AuthorityMatrix>);
    create(entity: Partial<AuthorityMatrix>): Promise<AuthorityMatrix>;
    update(id: string, entity: Partial<AuthorityMatrix>): Promise<AuthorityMatrix>;
    findById(id: string): Promise<AuthorityMatrix | null>;
    findActiveByRoleId(roleId: string): Promise<AuthorityMatrix[]>;
}
