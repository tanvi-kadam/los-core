import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Inject,
  forwardRef,
} from "@nestjs/common";
import { DataSource, EntityManager } from "typeorm";
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
import { ConsentRecord } from "./entities/consent-record.entity";
import { ConsentType } from "./entities/consent-type.entity";
import { DuplicateCheck } from "./entities/duplicate-check.entity";
import {
  ApplicationListItemDto,
  ListApplicationsQueryDto,
} from "./dto/list-applications.dto";
import { ApplicationStateTransition } from "../workflow/entities/application-state-transition.entity";

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
    private readonly dataSource: DataSource,
  ) {}

  private consentTypesCache: {
    items: {
      id: string;
      consent_code: string;
      description: string;
      version: number;
    }[];
    loadedAt: number;
  } | null = null;
  private static readonly CONSENT_TYPES_CACHE_TTL_MS = 5 * 60 * 1000;

  private async recordConsent(
    app: Application,
    dto: ConsentDto,
    userId: string,
    correlationId?: string,
    context?: { ip?: string; userAgent?: string },
    manager?: EntityManager,
  ): Promise<void> {
    if (manager) {
      const consentType = await manager.getRepository(ConsentType).findOne({
        where: { consentCode: dto.consentCode, isActive: true },
      });
      if (!consentType) {
        throw new BadRequestException("Invalid consent code");
      }
      await manager.getRepository(ConsentRecord).save({
        applicationId: app.id,
        consentTypeId: consentType.id,
        consentTextVersion: dto.consentTextVersion,
        ipAddress: context?.ip ?? null,
        userAgent: context?.userAgent ?? null,
        correlationId: correlationId ?? null,
      });
      const records = await manager.getRepository(ConsentRecord).find({
        where: { applicationId: app.id },
      });
      const consentStatus = records.length > 0 ? "CONSENTED" : "PENDING";
      await manager.getRepository(Application).save({
        ...app,
        consentStatus,
      });
      await this.auditService.record(
        {
          actorId: userId,
          actorRole: "",
          actionType: "CONSENT",
          objectType: "APPLICATION",
          objectId: app.id,
          correlationId: correlationId ?? null,
        },
        manager,
      );
      return;
    }
    const consentType = await this.consentTypeRepository.findActiveByCode(
      dto.consentCode,
    );
    if (!consentType) {
      throw new BadRequestException("Invalid consent code");
    }
    await this.consentRecordRepository.save({
      applicationId: app.id,
      consentTypeId: consentType.id,
      consentTextVersion: dto.consentTextVersion,
      ipAddress: context?.ip ?? null,
      userAgent: context?.userAgent ?? null,
      correlationId: correlationId ?? null,
    });
    const records = await this.consentRecordRepository.findByApplication(
      app.id,
    );
    const consentStatus = records.length > 0 ? "GIVEN" : "PENDING";
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
    { id: string; consent_code: string; description: string; version: number }[]
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
      version: ct.version,
    }));

    this.consentTypesCache = { items, loadedAt: now };
    return items;
  }

  async listApplications(query: ListApplicationsQueryDto): Promise<{
    items: ApplicationListItemDto[];
    page: number;
    limit: number;
    total: number;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const { items, total } = await this.applicationRepository.findPaged({
      state: query.state,
      page,
      limit,
    });

    const mapped: ApplicationListItemDto[] = items.map((a) => ({
      id: a.id,
      entity_type: a.entityType,
      entity_identifier: a.entityIdentifier,
      pan: a.pan,
      product_code: a.productCode,
      loan_amount: a.loanAmount,
      loan_tenure_months: a.loanTenureMonths,
      purpose: a.purpose,
      current_state: a.currentState,
      consent_status: a.consentStatus,
      duplicate_flag: a.duplicateFlag,
      created_by: a.createdBy,
      created_at: a.createdAt,
    }));

    return { items: mapped, page, limit, total };
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

    const app = await this.dataSource.transaction(async (manager) => {
      const applicationRepo = manager.getRepository(Application);
      const app = await applicationRepo.save({
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
        await manager.getRepository(DuplicateCheck).save({
          applicationId: app.id,
          matchedApplicationId: duplicate.id,
          matchReason: "PAN_OR_ENTITY_IDENTIFIER",
        });
      }

      await this.auditService.record(
        {
          actorId: userId,
          actorRole: "",
          actionType: "CREATE",
          objectType: "APPLICATION",
          objectId: app.id,
          afterStateHash: null,
          correlationId: correlationId ?? null,
        },
        manager,
      );

      if (dto.consents && dto.consents.length > 0) {
        for (const consent of dto.consents) {
          await this.recordConsent(
            app,
            consent,
            userId,
            correlationId,
            context,
            manager,
          );
        }
        await applicationRepo.save({
          ...app,
          consentStatus: "GIVEN",
        });
      }

      return app;
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
    roleId: string | undefined,
    correlationId?: string,
  ): Promise<{ application_id: string; current_state: string }> {
    const app = await this.applicationRepository.findById(applicationId);
    if (!app) throw new NotFoundException("Application not found");
    if (app.currentState !== "DRAFT") {
      throw new BadRequestException("Application is not in DRAFT state");
    }
    console.log("app.consentStatus", app);
    if (app.consentStatus !== "GIVEN") {
      throw new BadRequestException("Consent is not given");
    }

    const duplicateChecks =
      await this.duplicateCheckRepository.findByApplicationId(applicationId);

    if (
      duplicateChecks &&
      duplicateChecks.length > 0 &&
      duplicateChecks.some((dc) => dc.matchedApplicationId)
    ) {
      throw new ConflictException(
        "Duplicate application detected. Submission is blocked.",
      );
    }

    // Authority validation: ensure caller's role can approve this loan amount
    if (roleId) {
      await this.authorityService.checkAuthorityLimit(
        roleId,
        Number(app.loanAmount),
        userId,
        undefined,
      );
    }

    const fromState = app.currentState;
    const toState = "SUBMITTED";

    await this.dataSource.transaction(async (manager) => {
      const appRepo = manager.getRepository(Application);
      const transitionRepo = manager.getRepository(ApplicationStateTransition);

      await appRepo.save({
        ...app,
        currentState: toState,
      });

      await transitionRepo.save({
        applicationId,
        fromState,
        toState,
        triggeredBy: userId,
        triggeredRole: roleId ?? "",
        authoritySnapshot: null,
        occurredAt: new Date(),
        correlationId: correlationId ?? null,
      });
    });

    await this.auditService.record({
      actorId: userId,
      actorRole: roleId ?? "",
      actionType: "STATE_CHANGE",
      objectType: "APPLICATION",
      objectId: applicationId,
      beforeStateHash: fromState,
      afterStateHash: toState,
      correlationId: correlationId ?? null,
    });

    return {
      application_id: applicationId,
      current_state: toState,
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
