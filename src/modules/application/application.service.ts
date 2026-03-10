import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Inject,
  forwardRef,
} from "@nestjs/common";
import { ApplicationRepository } from "./repositories/application.repository";
import { ConsentRecordRepository } from "./repositories/consent-record.repository";
import { ConsentTypeRepository } from "./repositories/consent-type.repository";
import { DuplicateCheckRepository } from "./repositories/duplicate-check.repository";
import { WorkflowService } from "../workflow/workflow.service";
import { AuthorityService } from "../authority/authority.service";
import { AuditService } from "../audit/audit.service";
import { KafkaProducerService } from "../../infrastructure/kafka";
import { KAFKA_TOPICS } from "../../common/constants/kafka-topics";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";
import { ConsentDto } from "./dto/consent.dto";
import { Application } from "./entities/application.entity";

@Injectable()
export class ApplicationService {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly consentRecordRepository: ConsentRecordRepository,
    private readonly consentTypeRepository: ConsentTypeRepository,
    private readonly duplicateCheckRepository: DuplicateCheckRepository,
    private readonly auditService: AuditService,
    private readonly kafkaProducer: KafkaProducerService,
    @Inject(forwardRef(() => WorkflowService))
    private readonly workflowService: WorkflowService,
    private readonly authorityService: AuthorityService,
  ) {}

  private consentTypesCache: {
    items: { id: string; consent_code: string; description: string }[];
    loadedAt: number;
  } | null = null;
  private static readonly CONSENT_TYPES_CACHE_TTL_MS = 5 * 60 * 1000;

  private async recordConsent(
    app: Application,
    dto: ConsentDto,
    userId: string,
    correlationId?: string,
    context?: { ip?: string; userAgent?: string },
  ): Promise<void> {
    const consentType = await this.consentTypeRepository.findActiveByCode(
      dto.consentCode,
    );
    if (!consentType) {
      throw new BadRequestException("Invalid consent code");
    }

    console.log("consentType", consentType);
    console.log("dto", dto);
    console.log("userId", userId);
    console.log("correlationId", correlationId);
    console.log("context", context);

    await this.consentRecordRepository.save({
      applicationId: app.id,
      consentTypeId: consentType.id,
      // consentedAt: new Date(),
      consentTextVersion: dto.consentTextVersion,
      ipAddress: context?.ip ?? null,
      userAgent: context?.userAgent ?? null,
      correlationId: correlationId ?? null,
    });

    const records = await this.consentRecordRepository.findByApplication(
      app.id,
    );
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

  async getConsentTypes(): Promise<
    { id: string; consent_code: string; description: string }[]
  > {
    const now = Date.now();
    if (
      this.consentTypesCache &&
      now - this.consentTypesCache.loadedAt <
        ApplicationService.CONSENT_TYPES_CACHE_TTL_MS
    ) {
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

  async create(
    dto: CreateApplicationDto,
    userId: string,
    correlationId?: string,
    context?: { ip?: string; userAgent?: string },
  ): Promise<{ application_id: string; current_state: string }> {
    const duplicate =
      await this.applicationRepository.findDuplicateByPanAndProduct(
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

    // await this.kafkaProducer.send(KAFKA_TOPICS.APPLICATION_EVENTS, {
    //   event_type: 'ApplicationCreated',
    //   correlation_id: correlationId ?? '',
    //   payload: {
    //     application_id: app.id,
    //     entity_type: app.entityType,
    //     product_code: app.productCode,
    //     loan_amount: app.loanAmount,
    //     current_state: app.currentState,
    //     created_by: userId,
    //   },
    // });

    if (dto.consents && dto.consents.length > 0) {
      for (const consent of dto.consents) {
        await this.recordConsent(app, consent, userId, correlationId, context);
      }
    }

    return { application_id: app.id, current_state: app.currentState };
  }

  async update(
    id: string,
    dto: UpdateApplicationDto,
    userId: string,
    correlationId?: string,
  ): Promise<{ application_id: string; current_state: string }> {
    const app = await this.applicationRepository.findById(id);
    if (!app) throw new NotFoundException("Application not found");
    if (app.currentState !== "DRAFT") {
      throw new BadRequestException("Only DRAFT applications can be updated");
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

  async addConsent(
    applicationId: string,
    dto: ConsentDto,
    userId: string,
    correlationId?: string,
  ): Promise<{ status: string }> {
    const app = await this.applicationRepository.findById(applicationId);
    if (!app) throw new NotFoundException("Application not found");

    await this.recordConsent(app, dto, userId, correlationId);

    return { status: "CONSENTED" };
  }

  async submit(
    applicationId: string,
    userId: string,
    correlationId?: string,
  ): Promise<{ application_id: string; current_state: string }> {
    const app = await this.applicationRepository.findById(applicationId);
    if (!app) throw new NotFoundException("Application not found");
    if (app.currentState !== "DRAFT") {
      throw new BadRequestException("Application is not in DRAFT state");
    }
    if (app.consentStatus !== "CONSENTED") {
      throw new BadRequestException("Consent is required before submit");
    }

    const duplicateChecks =
      await this.duplicateCheckRepository.findByApplicationId(applicationId);
    if (!duplicateChecks || duplicateChecks.length === 0) {
      throw new ConflictException(
        "Duplicate detection must be executed before submission",
      );
    }

    // Authority validation: ensure caller's role can approve this loan amount
    await this.authorityService.checkAuthorityLimit(
      "" as unknown as string,
      Number(app.loanAmount),
      userId,
      undefined,
    );

    const transitionResult = await this.workflowService.transition(
      applicationId,
      { target_state: "SUBMITTED" },
      userId,
      "",
      null,
      correlationId,
    );

    return {
      application_id: transitionResult.application_id,
      current_state: "SUBMITTED",
    };
  }

  async findDuplicates(
    applicationId: string,
  ): Promise<{ duplicate_flag: boolean; matched_application_ids: string[] }> {
    const app = await this.applicationRepository.findById(applicationId);
    if (!app) throw new NotFoundException("Application not found");

    const matches = await this.applicationRepository.findDuplicatesForDetection(
      app.pan,
      app.entityIdentifier,
      applicationId,
    );

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
}
