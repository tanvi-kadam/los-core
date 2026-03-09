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
exports.ApplicationStateTransition = void 0;
const typeorm_1 = require("typeorm");
let ApplicationStateTransition = class ApplicationStateTransition {
};
exports.ApplicationStateTransition = ApplicationStateTransition;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ApplicationStateTransition.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'application_id', type: 'uuid' }),
    __metadata("design:type", String)
], ApplicationStateTransition.prototype, "applicationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'from_state', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], ApplicationStateTransition.prototype, "fromState", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'to_state', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], ApplicationStateTransition.prototype, "toState", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'triggered_by', type: 'uuid' }),
    __metadata("design:type", String)
], ApplicationStateTransition.prototype, "triggeredBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'triggered_role', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], ApplicationStateTransition.prototype, "triggeredRole", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'authority_snapshot', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ApplicationStateTransition.prototype, "authoritySnapshot", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'occurred_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], ApplicationStateTransition.prototype, "occurredAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'correlation_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], ApplicationStateTransition.prototype, "correlationId", void 0);
exports.ApplicationStateTransition = ApplicationStateTransition = __decorate([
    (0, typeorm_1.Entity)({ schema: 'workflow_schema', name: 'application_state_transitions' })
], ApplicationStateTransition);
//# sourceMappingURL=application-state-transition.entity.js.map