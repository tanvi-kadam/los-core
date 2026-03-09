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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorityMatrix = void 0;
const typeorm_1 = require("typeorm");
let AuthorityMatrix = class AuthorityMatrix {
};
exports.AuthorityMatrix = AuthorityMatrix;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AuthorityMatrix.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'role_id', type: 'uuid' }),
    __metadata("design:type", String)
], AuthorityMatrix.prototype, "roleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_loan_amount', type: 'numeric', precision: 18, scale: 2 }),
    __metadata("design:type", String)
], AuthorityMatrix.prototype, "maxLoanAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_deviation_percent', type: 'numeric', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], AuthorityMatrix.prototype, "maxDeviationPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'allowed_products', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], AuthorityMatrix.prototype, "allowedProducts", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'allowed_geographies', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], AuthorityMatrix.prototype, "allowedGeographies", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'effective_from', type: 'timestamp' }),
    __metadata("design:type", Date)
], AuthorityMatrix.prototype, "effectiveFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'effective_to', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], AuthorityMatrix.prototype, "effectiveTo", void 0);
exports.AuthorityMatrix = AuthorityMatrix = __decorate([
    (0, typeorm_1.Entity)({ schema: 'authority_schema', name: 'authority_matrix' })
], AuthorityMatrix);
//# sourceMappingURL=authority-matrix.entity.js.map