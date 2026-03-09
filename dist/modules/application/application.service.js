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
exports.ApplicationService = void 0;
const common_1 = require("@nestjs/common");
const application_repository_1 = require("./repositories/application.repository");
const consent_record_repository_1 = require("./repositories/consent-record.repository");
const consent_type_repository_1 = require("./repositories/consent-type.repository");
const duplicate_check_repository_1 = require("./repositories/duplicate-check.repository");
const audit_service_1 = require("../audit/audit.service");
const kafka_1 = require("../../infrastructure/kafka");
const kafka_topics_1 = require("../../common/constants/kafka-topics");
let ApplicationService = class ApplicationService {
    constructor(applicationRepository, consentRecordRepository, consentTypeRepository, duplicateCheckRepository, auditService, kafkaProducer) {
        this.applicationRepository = applicationRepository;
        this.consentRecordRepository = consentRecordRepository;
        this.consentTypeRepository = consentTypeRepository;
        this.duplicateCheckRepository = duplicateCheckRepository;
        this.auditService = auditService;
        this.kafkaProducer = kafkaProducer;
    }
    async create(dto, userId, correlationId) {
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
            currentState: 'DRAFT',
            consentStatus: 'PENDING',
            duplicateFlag,
            createdBy: userId,
        });
        if (duplicateFlag) {
            await this.duplicateCheckRepository.save({
                applicationId: app.id,
                checkType: 'PAN_PRODUCT',
                duplicateFlag: true,
            });
        }
        await this.auditService.record({
            actorId: userId,
            actorRole: '',
            actionType: 'CREATE',
            objectType: 'APPLICATION',
            objectId: app.id,
            afterStateHash: null,
            correlationId: correlationId ?? null,
        });
        await this.kafkaProducer.send(kafka_topics_1.KAFKA_TOPICS.APPLICATION_EVENTS, {
            event_type: 'ApplicationCreated',
            correlation_id: correlationId ?? '',
            payload: {
                application_id: app.id,
                entity_type: app.entityType,
                product_code: app.productCode,
                loan_amount: app.loanAmount,
                current_state: app.currentState,
                created_by: userId,
            },
        });
        return { application_id: app.id, current_state: app.currentState };
    }
    async update(id, dto, userId, correlationId) {
        const app = await this.applicationRepository.findById(id);
        if (!app)
            throw new common_1.NotFoundException('Application not found');
        if (app.currentState !== 'DRAFT') {
            throw new common_1.BadRequestException('Only DRAFT applications can be updated');
        }
        const updated = await this.applicationRepository.save({
            ...app,
            ...(dto.entityType != null && { entityType: dto.entityType }),
            ...(dto.entityIdentifier != null && { entityIdentifier: dto.entityIdentifier }),
            ...(dto.pan != null && { pan: dto.pan }),
            ...(dto.productCode != null && { productCode: dto.productCode }),
            ...(dto.loanAmount != null && { loanAmount: String(dto.loanAmount) }),
            ...(dto.loanTenureMonths != null && { loanTenureMonths: dto.loanTenureMonths }),
            ...(dto.purpose !== undefined && { purpose: dto.purpose }),
        });
        await this.auditService.record({
            actorId: userId,
            actorRole: '',
            actionType: 'UPDATE',
            objectType: 'APPLICATION',
            objectId: id,
            correlationId: correlationId ?? null,
        });
        return { application_id: updated.id, current_state: updated.currentState };
    }
    async addConsent(applicationId, dto, userId, correlationId) {
        const app = await this.applicationRepository.findById(applicationId);
        if (!app)
            throw new common_1.NotFoundException('Application not found');
        const consentType = await this.consentTypeRepository.findById(dto.consentTypeId);
        if (!consentType)
            throw new common_1.NotFoundException('Consent type not found');
        await this.consentRecordRepository.save({
            applicationId,
            consentTypeId: dto.consentTypeId,
            consentedAt: new Date(),
        });
        const records = await this.consentRecordRepository.findByApplication(applicationId);
        const consentStatus = records.length > 0 ? 'CONSENTED' : 'PENDING';
        await this.applicationRepository.save({ ...app, consentStatus });
        await this.auditService.record({
            actorId: userId,
            actorRole: '',
            actionType: 'CONSENT',
            objectType: 'APPLICATION',
            objectId: applicationId,
            correlationId: correlationId ?? null,
        });
        return { status: 'CONSENTED' };
    }
    async submit(applicationId, userId, correlationId) {
        const app = await this.applicationRepository.findById(applicationId);
        if (!app)
            throw new common_1.NotFoundException('Application not found');
        if (app.currentState !== 'DRAFT') {
            throw new common_1.BadRequestException('Application is not in DRAFT state');
        }
        if (app.consentStatus !== 'CONSENTED') {
            throw new common_1.BadRequestException('Consent is required before submit');
        }
        const updated = await this.applicationRepository.save({
            ...app,
            currentState: 'SUBMITTED',
        });
        await this.auditService.record({
            actorId: userId,
            actorRole: '',
            actionType: 'SUBMIT',
            objectType: 'APPLICATION',
            objectId: applicationId,
            beforeStateHash: app.currentState,
            afterStateHash: 'SUBMITTED',
            correlationId: correlationId ?? null,
        });
        await this.kafkaProducer.send(kafka_topics_1.KAFKA_TOPICS.APPLICATION_EVENTS, {
            event_type: 'ApplicationSubmitted',
            correlation_id: correlationId ?? '',
            payload: {
                application_id: updated.id,
                current_state: updated.currentState,
                submitted_by: userId,
            },
        });
        return { application_id: updated.id, current_state: updated.currentState };
    }
};
exports.ApplicationService = ApplicationService;
exports.ApplicationService = ApplicationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [application_repository_1.ApplicationRepository,
        consent_record_repository_1.ConsentRecordRepository,
        consent_type_repository_1.ConsentTypeRepository,
        duplicate_check_repository_1.DuplicateCheckRepository,
        audit_service_1.AuditService,
        kafka_1.KafkaProducerService])
], ApplicationService);
//# sourceMappingURL=application.service.js.map