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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ApplicationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationService = void 0;
const common_1 = require("@nestjs/common");
const application_repository_1 = require("./repositories/application.repository");
const consent_record_repository_1 = require("./repositories/consent-record.repository");
const consent_type_repository_1 = require("./repositories/consent-type.repository");
const duplicate_check_repository_1 = require("./repositories/duplicate-check.repository");
const workflow_service_1 = require("../workflow/workflow.service");
const authority_service_1 = require("../authority/authority.service");
const audit_service_1 = require("../audit/audit.service");
const kafka_1 = require("../../infrastructure/kafka");
let ApplicationService = ApplicationService_1 = class ApplicationService {
    constructor(applicationRepository, consentRecordRepository, consentTypeRepository, duplicateCheckRepository, auditService, kafkaProducer, workflowService, authorityService) {
        this.applicationRepository = applicationRepository;
        this.consentRecordRepository = consentRecordRepository;
        this.consentTypeRepository = consentTypeRepository;
        this.duplicateCheckRepository = duplicateCheckRepository;
        this.auditService = auditService;
        this.kafkaProducer = kafkaProducer;
        this.workflowService = workflowService;
        this.authorityService = authorityService;
        this.consentTypesCache = null;
    }
    async recordConsent(app, dto, userId, correlationId, context) {
        const consentType = await this.consentTypeRepository.findActiveByCode(dto.consentCode);
        if (!consentType) {
            throw new common_1.BadRequestException("Invalid consent code");
        }
        console.log("consentType", consentType);
        console.log("dto", dto);
        console.log("userId", userId);
        console.log("correlationId", correlationId);
        console.log("context", context);
        await this.consentRecordRepository.save({
            applicationId: app.id,
            consentTypeId: consentType.id,
            consentTextVersion: dto.consentTextVersion,
            ipAddress: context?.ip ?? null,
            userAgent: context?.userAgent ?? null,
            correlationId: correlationId ?? null,
        });
        const records = await this.consentRecordRepository.findByApplication(app.id);
        const consentStatus = records.length > 0 ? "CONSENTED" : "PENDING";
        await this.applicationRepository.save({
            ...app,
            consentStatus,
        });
        await this.auditService.record({
            actorId: userId,
            actorRole: "",
            actionType: "CONSENT",
            objectType: "APPLICATION",
            objectId: app.id,
            correlationId: correlationId ?? null,
        });
    }
    async getConsentTypes() {
        const now = Date.now();
        if (this.consentTypesCache &&
            now - this.consentTypesCache.loadedAt <
                ApplicationService_1.CONSENT_TYPES_CACHE_TTL_MS) {
            return this.consentTypesCache.items;
        }
        const list = await this.consentTypeRepository.findAllActive();
        const items = list.map((ct) => ({
            id: ct.id,
            consent_code: ct.consentCode,
            description: ct.description,
        }));
        this.consentTypesCache = { items, loadedAt: now };
        return items;
    }
    async create(dto, userId, correlationId, context) {
        const duplicate = await this.applicationRepository.findDuplicateByPanAndProduct(dto.pan, dto.productCode);
        const duplicateFlag = !!duplicate;
        const app = await this.applicationRepository.save({
            entityType: dto.entityType,
            entityIdentifier: dto.entityIdentifier,
            pan: dto.pan,
            productCode: dto.productCode,
            loanAmount: String(dto.loanAmount),
            loanTenureMonths: dto.loanTenureMonths,
            purpose: dto.purpose ?? null,
            currentState: "DRAFT",
            consentStatus: "PENDING",
            duplicateFlag,
            createdBy: userId,
        });
        if (duplicateFlag && duplicate) {
            await this.duplicateCheckRepository.save({
                applicationId: app.id,
                matchedApplicationId: duplicate.id,
                matchReason: "PAN_OR_ENTITY_IDENTIFIER",
            });
        }
        await this.auditService.record({
            actorId: userId,
            actorRole: "",
            actionType: "CREATE",
            objectType: "APPLICATION",
            objectId: app.id,
            afterStateHash: null,
            correlationId: correlationId ?? null,
        });
        if (dto.consents && dto.consents.length > 0) {
            for (const consent of dto.consents) {
                await this.recordConsent(app, consent, userId, correlationId, context);
            }
        }
        return { application_id: app.id, current_state: app.currentState };
    }
    async update(id, dto, userId, correlationId) {
        const app = await this.applicationRepository.findById(id);
        if (!app)
            throw new common_1.NotFoundException("Application not found");
        if (app.currentState !== "DRAFT") {
            throw new common_1.BadRequestException("Only DRAFT applications can be updated");
        }
        const updated = await this.applicationRepository.save({
            ...app,
            ...(dto.entityType != null && { entityType: dto.entityType }),
            ...(dto.entityIdentifier != null && {
                entityIdentifier: dto.entityIdentifier,
            }),
            ...(dto.pan != null && { pan: dto.pan }),
            ...(dto.productCode != null && { productCode: dto.productCode }),
            ...(dto.loanAmount != null && { loanAmount: String(dto.loanAmount) }),
            ...(dto.loanTenureMonths != null && {
                loanTenureMonths: dto.loanTenureMonths,
            }),
            ...(dto.purpose !== undefined && { purpose: dto.purpose }),
        });
        await this.auditService.record({
            actorId: userId,
            actorRole: "",
            actionType: "UPDATE",
            objectType: "APPLICATION",
            objectId: id,
            correlationId: correlationId ?? null,
        });
        return { application_id: updated.id, current_state: updated.currentState };
    }
    async addConsent(applicationId, dto, userId, correlationId) {
        const app = await this.applicationRepository.findById(applicationId);
        if (!app)
            throw new common_1.NotFoundException("Application not found");
        await this.recordConsent(app, dto, userId, correlationId);
        return { status: "CONSENTED" };
    }
    async submit(applicationId, userId, correlationId) {
        const app = await this.applicationRepository.findById(applicationId);
        if (!app)
            throw new common_1.NotFoundException("Application not found");
        if (app.currentState !== "DRAFT") {
            throw new common_1.BadRequestException("Application is not in DRAFT state");
        }
        if (app.consentStatus !== "CONSENTED") {
            throw new common_1.BadRequestException("Consent is required before submit");
        }
        const duplicateChecks = await this.duplicateCheckRepository.findByApplicationId(applicationId);
        if (!duplicateChecks || duplicateChecks.length === 0) {
            throw new common_1.ConflictException("Duplicate detection must be executed before submission");
        }
        await this.authorityService.checkAuthorityLimit("", Number(app.loanAmount), userId, undefined);
        const transitionResult = await this.workflowService.transition(applicationId, { target_state: "SUBMITTED" }, userId, "", null, correlationId);
        return {
            application_id: transitionResult.application_id,
            current_state: "SUBMITTED",
        };
    }
    async findDuplicates(applicationId) {
        const app = await this.applicationRepository.findById(applicationId);
        if (!app)
            throw new common_1.NotFoundException("Application not found");
        const matches = await this.applicationRepository.findDuplicatesForDetection(app.pan, app.entityIdentifier, applicationId);
        const matchedIds = matches.map((m) => m.id);
        const duplicateFlag = matchedIds.length > 0;
        if (duplicateFlag) {
            await this.applicationRepository.save({
                ...app,
                duplicateFlag: true,
            });
            for (const matched of matches) {
                await this.duplicateCheckRepository.save({
                    applicationId,
                    matchedApplicationId: matched.id,
                    matchReason: "PAN_OR_ENTITY_IDENTIFIER",
                });
            }
        }
        return {
            duplicate_flag: duplicateFlag,
            matched_application_ids: matchedIds,
        };
    }
};
exports.ApplicationService = ApplicationService;
ApplicationService.CONSENT_TYPES_CACHE_TTL_MS = 5 * 60 * 1000;
exports.ApplicationService = ApplicationService = ApplicationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(6, (0, common_1.Inject)((0, common_1.forwardRef)(() => workflow_service_1.WorkflowService))),
    __metadata("design:paramtypes", [application_repository_1.ApplicationRepository,
        consent_record_repository_1.ConsentRecordRepository,
        consent_type_repository_1.ConsentTypeRepository,
        duplicate_check_repository_1.DuplicateCheckRepository,
        audit_service_1.AuditService,
        kafka_1.KafkaProducerService,
        workflow_service_1.WorkflowService,
        authority_service_1.AuthorityService])
], ApplicationService);
//# sourceMappingURL=application.service.js.map