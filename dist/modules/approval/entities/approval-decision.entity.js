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
exports.ApprovalDecision = void 0;
const typeorm_1 = require("typeorm");
const approval_request_entity_1 = require("./approval-request.entity");
let ApprovalDecision = class ApprovalDecision {
};
exports.ApprovalDecision = ApprovalDecision;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ApprovalDecision.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approval_request_id', type: 'uuid' }),
    __metadata("design:type", String)
], ApprovalDecision.prototype, "approvalRequestId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'checker_id', type: 'uuid' }),
    __metadata("design:type", String)
], ApprovalDecision.prototype, "checkerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], ApprovalDecision.prototype, "decision", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'authority_snapshot', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ApprovalDecision.prototype, "authoritySnapshot", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'decided_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], ApprovalDecision.prototype, "decidedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => approval_request_entity_1.ApprovalRequest),
    (0, typeorm_1.JoinColumn)({ name: 'approval_request_id' }),
    __metadata("design:type", approval_request_entity_1.ApprovalRequest)
], ApprovalDecision.prototype, "approvalRequest", void 0);
exports.ApprovalDecision = ApprovalDecision = __decorate([
    (0, typeorm_1.Entity)({ schema: 'approval_schema', name: 'approval_decisions' })
], ApprovalDecision);
//# sourceMappingURL=approval-decision.entity.js.map