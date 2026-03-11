import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, LessThanOrEqual, MoreThanOrEqual, IsNull } from "typeorm";
import { AuthorityMatrix } from "../entities/authority-matrix.entity";

@Injectable()
export class AuthorityRepository {
  constructor(
    @InjectRepository(AuthorityMatrix)
    private readonly repo: Repository<AuthorityMatrix>,
  ) {}

  async create(entity: Partial<AuthorityMatrix>): Promise<AuthorityMatrix> {
    const created = this.repo.create(entity);
    return this.repo.save(created);
  }

  async update(
    id: string,
    entity: Partial<AuthorityMatrix>,
  ): Promise<AuthorityMatrix> {
    await this.repo.update(id, entity as Record<string, unknown>);
    const updated = await this.repo.findOne({ where: { id } });
    if (!updated) throw new Error("Authority matrix not found after update");
    return updated;
  }

  async findById(id: string): Promise<AuthorityMatrix | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findActiveByRoleId(roleId: string): Promise<AuthorityMatrix[]> {
    const now = new Date();
    return this.repo.find({
      where: [
        { roleId, effectiveFrom: LessThanOrEqual(now), effectiveTo: IsNull() },
        {
          roleId,
          effectiveFrom: LessThanOrEqual(now),
          effectiveTo: MoreThanOrEqual(now),
        },
      ],
      order: { maxLoanAmount: "DESC" },
    });
  }
}
