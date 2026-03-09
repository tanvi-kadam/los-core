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
exports.EntitySnapshot = void 0;
const typeorm_1 = require("typeorm");
let EntitySnapshot = class EntitySnapshot {
};
exports.EntitySnapshot = EntitySnapshot;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EntitySnapshot.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'application_id', type: 'uuid' }),
    __metadata("design:type", String)
], EntitySnapshot.prototype, "applicationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mca_reference_id', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], EntitySnapshot.prototype, "mcaReferenceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'legal_name', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], EntitySnapshot.prototype, "legalName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'registration_number', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], EntitySnapshot.prototype, "registrationNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'incorporation_date', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], EntitySnapshot.prototype, "incorporationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'company_status', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], EntitySnapshot.prototype, "companyStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'company_type', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], EntitySnapshot.prototype, "companyType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'registered_address', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], EntitySnapshot.prototype, "registeredAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'snapshot_version', type: 'integer', default: 1 }),
    __metadata("design:type", Number)
], EntitySnapshot.prototype, "snapshotVersion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pulled_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], EntitySnapshot.prototype, "pulledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'raw_response', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], EntitySnapshot.prototype, "rawResponse", void 0);
exports.EntitySnapshot = EntitySnapshot = __decorate([
    (0, typeorm_1.Entity)({ schema: 'integration_schema', name: 'entity_snapshots' })
], EntitySnapshot);
//# sourceMappingURL=entity-snapshot.entity.js.map