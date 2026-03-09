import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApplicationRepository } from './repositories/application.repository';
import { ConsentRecordRepository } from './repositories/consent-record.repository';
import { ConsentTypeRepository } from './repositories/consent-type.repository';
import { DuplicateCheckRepository } from './repositories/duplicate-check.repository';
import { AuditService } from '../audit/audit.service';
import { KafkaProducerService } from '../../infrastructure/kafka';
import { KAFKA_TOPICS } from '../../common/constants/kafka-topics';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ConsentDto } from './dto/consent.dto';

@Injectable()
export class ApplicationService {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly consentRecordRepository: ConsentRecordRepository,
    private readonly consentTypeRepository: ConsentTypeRepository,
    private readonly duplicateCheckRepository: DuplicateCheckRepository,
    private readonly auditService: AuditService,
    private readonly kafkaProducer: KafkaProducerService,
  ) {}

  async create(
    dto: CreateApplicationDto,
    userId: string,
    correlationId?: string,
  ): Promise<{ application_id: string; current_state: string }> {
    const duplicate = await this.applicationRepository.findDuplicateByPanAndProduct(
      dto.pan,
      dto.productCode,
    );
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

    await this.kafkaProducer.send(KAFKA_TOPICS.APPLICATION_EVENTS, {
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

  async update(
    id: string,
    dto: UpdateApplicationDto,
    userId: string,
    correlationId?: string,
  ): Promise<{ application_id: string; current_state: string }> {
    const app = await this.applicationRepository.findById(id);
    if (!app) throw new NotFoundException('Application not found');
    if (app.currentState !== 'DRAFT') {
      throw new BadRequestException('Only DRAFT applications can be updated');
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

  async addConsent(
    applicationId: string,
    dto: ConsentDto,
    userId: string,
    correlationId?: string,
  ): Promise<{ status: string }> {
    const app = await this.applicationRepository.findById(applicationId);
    if (!app) throw new NotFoundException('Application not found');
    const consentType = await this.consentTypeRepository.findById(dto.consentTypeId);
    if (!consentType) throw new NotFoundException('Consent type not found');

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

  async submit(
    applicationId: string,
    userId: string,
    correlationId?: string,
  ): Promise<{ application_id: string; current_state: string }> {
    const app = await this.applicationRepository.findById(applicationId);
    if (!app) throw new NotFoundException('Application not found');
    if (app.currentState !== 'DRAFT') {
      throw new BadRequestException('Application is not in DRAFT state');
    }
    if (app.consentStatus !== 'CONSENTED') {
      throw new BadRequestException('Consent is required before submit');
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

    await this.kafkaProducer.send(KAFKA_TOPICS.APPLICATION_EVENTS, {
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
}
