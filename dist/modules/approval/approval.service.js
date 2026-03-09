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
exports.ApprovalService = void 0;
const common_1 = require("@nestjs/common");
const approval_request_repository_1 = require("./repositories/approval-request.repository");
const approval_decision_repository_1 = require("./repositories/approval-decision.repository");
const audit_service_1 = require("../audit/audit.service");
const kafka_1 = require("../../infrastructure/kafka");
const kafka_topics_1 = require("../../common/constants/kafka-topics");
let ApprovalService = class ApprovalService {
    constructor(approvalRequestRepository, approvalDecisionRepository, auditService, kafkaProducer) {
        this.approvalRequestRepository = approvalRequestRepository;
        this.approvalDecisionRepository = approvalDecisionRepository;
        this.auditService = auditService;
        this.kafkaProducer = kafkaProducer;
    }
    async createRequest(dto, makerId, correlationId) {
        const request = await this.approvalRequestRepository.save({
            objectType: dto.objectType,
            objectId: dto.objectId,
            actionType: dto.actionType,
            makerId,
            status: 'PENDING',
        });
        await this.auditService.record({
            actorId: makerId,
            actorRole: '',
            actionType: 'APPROVAL_REQUEST',
            objectType: 'APPROVAL_REQUEST',
            objectId: request.id,
            correlationId: correlationId ?? null,
        });
        await this.kafkaProducer.send(kafka_topics_1.KAFKA_TOPICS.APPROVAL_EVENTS, {
            event_type: 'ApprovalRequested',
            correlation_id: correlationId ?? '',
            payload: {
                approval_request_id: request.id,
                object_type: request.objectType,
                object_id: request.objectId,
                action_type: request.actionType,
                maker_id: makerId,
                status: request.status,
            },
        });
        return {
            id: request.id,
            object_type: request.objectType,
            object_id: request.objectId,
            action_type: request.actionType,
            status: request.status,
        };
    }
    async recordDecision(approvalRequestId, dto, checkerId, correlationId) {
        const request = await this.approvalRequestRepository.findById(approvalRequestId);
        if (!request)
            throw new common_1.NotFoundException('Approval request not found');
        if (request.status !== 'PENDING') {
            throw new common_1.BadRequestException('Approval request is not PENDING');
        }
        if (request.makerId === checkerId) {
            throw new common_1.BadRequestException('Checker cannot be the same as maker (maker-checker rule)');
        }
        await this.approvalDecisionRepository.save({
            approvalRequestId,
            checkerId,
            decision: dto.decision,
            authoritySnapshot: dto.authoritySnapshot ?? null,
            decidedAt: new Date(),
        });
        await this.approvalRequestRepository.save({
            ...request,
            status: dto.decision,
        });
        await this.auditService.record({
            actorId: checkerId,
            actorRole: '',
            authoritySnapshot: dto.authoritySnapshot ?? undefined,
            actionType: 'APPROVAL_DECISION',
            objectType: 'APPROVAL_REQUEST',
            objectId: approvalRequestId,
            afterStateHash: dto.decision,
            correlationId: correlationId ?? null,
        });
        await this.kafkaProducer.send(kafka_topics_1.KAFKA_TOPICS.APPROVAL_EVENTS, {
            event_type: 'ApprovalDecision',
            correlation_id: correlationId ?? '',
            payload: {
                approval_request_id: approvalRequestId,
                checker_id: checkerId,
                decision: dto.decision,
            },
        });
        return { approval_request_id: approvalRequestId, decision: dto.decision };
    }
};
exports.ApprovalService = ApprovalService;
exports.ApprovalService = ApprovalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [approval_request_repository_1.ApprovalRequestRepository,
        approval_decision_repository_1.ApprovalDecisionRepository,
        audit_service_1.AuditService,
        kafka_1.KafkaProducerService])
], ApprovalService);
//# sourceMappingURL=approval.service.js.map