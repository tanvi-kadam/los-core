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
exports.RecordAuditDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class RecordAuditDto {
}
exports.RecordAuditDto = RecordAuditDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Actor user ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], RecordAuditDto.prototype, "actorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Actor role' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordAuditDto.prototype, "actorRole", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Authority snapshot at time of action' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], RecordAuditDto.prototype, "authoritySnapshot", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Action type (e.g. CREATE, UPDATE, SUBMIT)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordAuditDto.prototype, "actionType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Object type (e.g. APPLICATION, APPROVAL)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordAuditDto.prototype, "objectType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Target object ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", Object)
], RecordAuditDto.prototype, "objectId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Hash of state before action' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], RecordAuditDto.prototype, "beforeStateHash", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Hash of state after action' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], RecordAuditDto.prototype, "afterStateHash", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Correlation ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], RecordAuditDto.prototype, "correlationId", void 0);
//# sourceMappingURL=record-audit.dto.js.map