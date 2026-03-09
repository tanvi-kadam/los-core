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
exports.AmlRiskProfile = void 0;
const typeorm_1 = require("typeorm");
let AmlRiskProfile = class AmlRiskProfile {
};
exports.AmlRiskProfile = AmlRiskProfile;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AmlRiskProfile.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'application_id', type: 'uuid' }),
    __metadata("design:type", String)
], AmlRiskProfile.prototype, "applicationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'entity_risk_score', type: 'integer' }),
    __metadata("design:type", Number)
], AmlRiskProfile.prototype, "entityRiskScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'director_risk_score', type: 'integer' }),
    __metadata("design:type", Number)
], AmlRiskProfile.prototype, "directorRiskScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'structural_risk_score', type: 'integer' }),
    __metadata("design:type", Number)
], AmlRiskProfile.prototype, "structuralRiskScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'jurisdiction_risk_score', type: 'integer' }),
    __metadata("design:type", Number)
], AmlRiskProfile.prototype, "jurisdictionRiskScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'composite_score', type: 'integer' }),
    __metadata("design:type", Number)
], AmlRiskProfile.prototype, "compositeScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'risk_band', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], AmlRiskProfile.prototype, "riskBand", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'computed_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], AmlRiskProfile.prototype, "computedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'model_version', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], AmlRiskProfile.prototype, "modelVersion", void 0);
exports.AmlRiskProfile = AmlRiskProfile = __decorate([
    (0, typeorm_1.Entity)({ schema: 'aml_schema', name: 'aml_risk_profiles' })
], AmlRiskProfile);
//# sourceMappingURL=aml-risk-profile.entity.js.map