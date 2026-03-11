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
exports.WorkflowService = void 0;
const common_1 = require("@nestjs/common");
const workflow_repository_1 = require("./repositories/workflow.repository");
const application_repository_1 = require("../application/repositories/application.repository");
const audit_service_1 = require("../audit/audit.service");
const kafka_1 = require("../../infrastructure/kafka");
let WorkflowService = class WorkflowService {
    constructor(workflowRepository, applicationRepository, auditService, kafkaProducer) {
        this.workflowRepository = workflowRepository;
        this.applicationRepository = applicationRepository;
        this.auditService = auditService;
        this.kafkaProducer = kafkaProducer;
    }
    async transition(applicationId, dto, userId, triggeredRole, authoritySnapshot, correlationId) {
        const app = await this.applicationRepository.findById(applicationId);
        if (!app)
            throw new common_1.NotFoundException("Application not found");
        const fromState = app.currentState;
        const toState = dto.target_state;
        if (fromState === toState) {
            throw new common_1.BadRequestException("Target state is same as current state");
        }
        if (!(fromState === "DRAFT" && toState === "SUBMITTED")) {
            throw new common_1.ConflictException("Invalid state transition for application");
        }
        await this.applicationRepository.save({
            ...app,
            currentState: toState,
        });
        await this.workflowRepository.save({
            applicationId,
            fromState,
            toState,
            triggeredBy: userId,
            triggeredRole,
            authoritySnapshot,
            occurredAt: new Date(),
            correlationId: correlationId ?? null,
        });
        await this.auditService.record({
            actorId: userId,
            actorRole: triggeredRole,
            authoritySnapshot: authoritySnapshot ?? undefined,
            actionType: "STATE_CHANGE",
            objectType: "APPLICATION",
            objectId: applicationId,
            beforeStateHash: fromState,
            afterStateHash: toState,
            correlationId: correlationId ?? null,
        });
        return {
            application_id: applicationId,
            from_state: fromState,
            to_state: toState,
        };
    }
    async getTransitionsForApplication(applicationId) {
        const transitions = await this.workflowRepository.findByApplicationId(applicationId);
        return transitions.map((t) => ({
            id: t.id,
            application_id: t.applicationId,
            from_state: t.fromState,
            to_state: t.toState,
            triggered_by: t.triggeredBy,
            triggered_role: t.triggeredRole,
            authority_snapshot: t.authoritySnapshot,
            correlation_id: t.correlationId,
            occurred_at: t.occurredAt,
        }));
    }
};
exports.WorkflowService = WorkflowService;
exports.WorkflowService = WorkflowService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [workflow_repository_1.WorkflowRepository,
        application_repository_1.ApplicationRepository,
        audit_service_1.AuditService,
        kafka_1.KafkaProducerService])
], WorkflowService);
//# sourceMappingURL=workflow.service.js.map