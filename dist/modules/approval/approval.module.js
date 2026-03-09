"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApprovalModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const approval_request_entity_1 = require("./entities/approval-request.entity");
const approval_decision_entity_1 = require("./entities/approval-decision.entity");
const approval_request_repository_1 = require("./repositories/approval-request.repository");
const approval_decision_repository_1 = require("./repositories/approval-decision.repository");
const approval_service_1 = require("./approval.service");
const approval_controller_1 = require("./approval.controller");
const audit_module_1 = require("../audit/audit.module");
const kafka_1 = require("../../infrastructure/kafka");
let ApprovalModule = class ApprovalModule {
};
exports.ApprovalModule = ApprovalModule;
exports.ApprovalModule = ApprovalModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([approval_request_entity_1.ApprovalRequest, approval_decision_entity_1.ApprovalDecision]),
            audit_module_1.AuditModule,
            kafka_1.KafkaModule,
        ],
        controllers: [approval_controller_1.ApprovalController],
        providers: [
            approval_request_repository_1.ApprovalRequestRepository,
            approval_decision_repository_1.ApprovalDecisionRepository,
            approval_service_1.ApprovalService,
        ],
        exports: [approval_service_1.ApprovalService],
    })
], ApprovalModule);
//# sourceMappingURL=approval.module.js.map