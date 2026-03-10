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
exports.ConsentRecord = void 0;
const typeorm_1 = require("typeorm");
const application_entity_1 = require("./application.entity");
const consent_type_entity_1 = require("./consent-type.entity");
let ConsentRecord = class ConsentRecord {
};
exports.ConsentRecord = ConsentRecord;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ConsentRecord.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'application_id', type: 'uuid' }),
    __metadata("design:type", String)
], ConsentRecord.prototype, "applicationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'consent_type_id', type: 'uuid' }),
    __metadata("design:type", String)
], ConsentRecord.prototype, "consentTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'consent_text_version', type: 'integer', nullable: true }),
    __metadata("design:type", Object)
], ConsentRecord.prototype, "consentTextVersion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ip_address', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], ConsentRecord.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_agent', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], ConsentRecord.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'correlation_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], ConsentRecord.prototype, "correlationId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ConsentRecord.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => application_entity_1.Application, (a) => a.consentRecords, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'application_id' }),
    __metadata("design:type", application_entity_1.Application)
], ConsentRecord.prototype, "application", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => consent_type_entity_1.ConsentType),
    (0, typeorm_1.JoinColumn)({ name: 'consent_type_id' }),
    __metadata("design:type", consent_type_entity_1.ConsentType)
], ConsentRecord.prototype, "consentType", void 0);
exports.ConsentRecord = ConsentRecord = __decorate([
    (0, typeorm_1.Entity)({ schema: 'application_schema', name: 'consent_records' })
], ConsentRecord);
//# sourceMappingURL=consent-record.entity.js.map