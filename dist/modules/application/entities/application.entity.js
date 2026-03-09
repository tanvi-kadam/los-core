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
exports.Application = void 0;
const typeorm_1 = require("typeorm");
const consent_record_entity_1 = require("./consent-record.entity");
const duplicate_check_entity_1 = require("./duplicate-check.entity");
let Application = class Application {
};
exports.Application = Application;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Application.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'entity_type', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Application.prototype, "entityType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'entity_identifier', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Application.prototype, "entityIdentifier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Application.prototype, "pan", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_code', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Application.prototype, "productCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'loan_amount', type: 'numeric', precision: 18, scale: 2 }),
    __metadata("design:type", String)
], Application.prototype, "loanAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'loan_tenure_months', type: 'integer' }),
    __metadata("design:type", Number)
], Application.prototype, "loanTenureMonths", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Application.prototype, "purpose", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'current_state', type: 'varchar', length: 50, default: 'DRAFT' }),
    __metadata("design:type", String)
], Application.prototype, "currentState", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'consent_status', type: 'varchar', length: 20, default: 'PENDING' }),
    __metadata("design:type", String)
], Application.prototype, "consentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'duplicate_flag', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Application.prototype, "duplicateFlag", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'uuid' }),
    __metadata("design:type", String)
], Application.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Application.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Application.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => consent_record_entity_1.ConsentRecord, (c) => c.application),
    __metadata("design:type", Array)
], Application.prototype, "consentRecords", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => duplicate_check_entity_1.DuplicateCheck, (d) => d.application),
    __metadata("design:type", Array)
], Application.prototype, "duplicateChecks", void 0);
exports.Application = Application = __decorate([
    (0, typeorm_1.Entity)({ schema: 'application_schema', name: 'applications' })
], Application);
//# sourceMappingURL=application.entity.js.map