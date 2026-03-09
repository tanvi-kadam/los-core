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
exports.CreateApplicationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateApplicationDto {
}
exports.CreateApplicationDto = CreateApplicationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PRIVATE_LIMITED', description: 'Entity type' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "entityType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'U12345MH2020PTC123456', description: 'Entity identifier' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "entityIdentifier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ABCDE1234F', description: 'PAN' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "pan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'TERM_LOAN', description: 'Product code' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "productCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5000000, description: 'Loan amount' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateApplicationDto.prototype, "loanAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 36, description: 'Loan tenure in months' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateApplicationDto.prototype, "loanTenureMonths", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Working capital', description: 'Purpose' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateApplicationDto.prototype, "purpose", void 0);
//# sourceMappingURL=create-application.dto.js.map