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
exports.DuplicateCheck = void 0;
const typeorm_1 = require("typeorm");
const application_entity_1 = require("./application.entity");
let DuplicateCheck = class DuplicateCheck {
};
exports.DuplicateCheck = DuplicateCheck;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DuplicateCheck.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'application_id', type: 'uuid' }),
    __metadata("design:type", String)
], DuplicateCheck.prototype, "applicationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'check_type', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], DuplicateCheck.prototype, "checkType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'duplicate_flag', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], DuplicateCheck.prototype, "duplicateFlag", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], DuplicateCheck.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => application_entity_1.Application, (a) => a.duplicateChecks, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'application_id' }),
    __metadata("design:type", application_entity_1.Application)
], DuplicateCheck.prototype, "application", void 0);
exports.DuplicateCheck = DuplicateCheck = __decorate([
    (0, typeorm_1.Entity)({ schema: 'application_schema', name: 'duplicate_checks' })
], DuplicateCheck);
//# sourceMappingURL=duplicate-check.entity.js.map