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
exports.ApplicationRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const application_entity_1 = require("../entities/application.entity");
let ApplicationRepository = class ApplicationRepository {
    constructor(repo) {
        this.repo = repo;
    }
    async save(entity) {
        const created = this.repo.create(entity);
        return this.repo.save(created);
    }
    async findById(id) {
        return this.repo.findOne({ where: { id } });
    }
    async findDuplicateByPanAndProduct(pan, productCode, excludeId) {
        const qb = this.repo
            .createQueryBuilder('a')
            .where('a.pan = :pan', { pan })
            .andWhere('a.product_code = :productCode', { productCode });
        if (excludeId)
            qb.andWhere('a.id != :excludeId', { excludeId });
        return qb.getOne();
    }
};
exports.ApplicationRepository = ApplicationRepository;
exports.ApplicationRepository = ApplicationRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ApplicationRepository);
//# sourceMappingURL=application.repository.js.map