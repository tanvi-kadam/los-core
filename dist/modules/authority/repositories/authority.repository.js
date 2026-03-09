"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorityRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const authority_matrix_entity_1 = require("../entities/authority-matrix.entity");
let AuthorityRepository = class AuthorityRepository {
    constructor(repo) {
        this.repo = repo;
    }
    async create(entity) {
        const created = this.repo.create(entity);
        return this.repo.save(created);
    }
    async update(id, entity) {
        await this.repo.update(id, entity);
        const updated = await this.repo.findOne({ where: { id } });
        if (!updated)
            throw new Error('Authority matrix not found after update');
        return updated;
    }
    async findById(id) {
        return this.repo.findOne({ where: { id } });
    }
    async findActiveByRoleId(roleId) {
        const now = new Date();
        return this.repo.find({
            where: [
                { roleId, effectiveFrom: (0, typeorm_2.LessThanOrEqual)(now), effectiveTo: (0, typeorm_2.IsNull)() },
                { roleId, effectiveFrom: (0, typeorm_2.LessThanOrEqual)(now), effectiveTo: (0, typeorm_2.MoreThanOrEqual)(now) },
            ],
            order: { maxLoanAmount: 'DESC' },
        });
    }
};
exports.AuthorityRepository = AuthorityRepository;
exports.AuthorityRepository = AuthorityRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(authority_matrix_entity_1.AuthorityMatrix)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AuthorityRepository);
//# sourceMappingURL=authority.repository.js.map