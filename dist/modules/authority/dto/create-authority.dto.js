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
exports.CreateAuthorityDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateAuthorityDto {
}
exports.CreateAuthorityDto = CreateAuthorityDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Role ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAuthorityDto.prototype, "role_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1000000, description: 'Maximum loan amount' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateAuthorityDto.prototype, "max_loan_amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5, description: 'Maximum deviation percent', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateAuthorityDto.prototype, "max_deviation_percent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['WORKING_CAPITAL', 'TERM_LOAN'], required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateAuthorityDto.prototype, "allowed_products", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['IN', 'KE'], required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateAuthorityDto.prototype, "allowed_geographies", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-01-01T00:00:00Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAuthorityDto.prototype, "effective_from", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-12-31T23:59:59Z', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAuthorityDto.prototype, "effective_to", void 0);
//# sourceMappingURL=create-authority.dto.js.map