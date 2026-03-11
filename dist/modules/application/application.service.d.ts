import { DataSource } from "typeorm";
import { ApplicationRepository } from "./repositories/application.repository";
import { ConsentRecordRepository } from "./repositories/consent-record.repository";
import { ConsentTypeRepository } from "./repositories/consent-type.repository";
import { DuplicateCheckRepository } from "./repositories/duplicate-check.repository";
import { WorkflowService } from "../workflow/workflow.service";
import { AuthorityService } from "../authority/authority.service";
import { AuditService } from "../audit/audit.service";
import { KafkaProducerService } from "../../infrastructure/kafka";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";
import { ConsentDto } from "./dto/consent.dto";
import { ApplicationListItemDto, ListApplicationsQueryDto } from "./dto/list-applications.dto";
export declare class ApplicationService {
    private readonly applicationRepository;
    private readonly consentRecordRepository;
    private readonly consentTypeRepository;
    private readonly duplicateCheckRepository;
    private readonly auditService;
    private readonly kafkaProducer;
    private readonly workflowService;
    private readonly authorityService;
    private readonly dataSource;
    constructor(applicationRepository: ApplicationRepository, consentRecordRepository: ConsentRecordRepository, consentTypeRepository: ConsentTypeRepository, duplicateCheckRepository: DuplicateCheckRepository, auditService: AuditService, kafkaProducer: KafkaProducerService, workflowService: WorkflowService, authorityService: AuthorityService, dataSource: DataSource);
    private consentTypesCache;
    private static readonly CONSENT_TYPES_CACHE_TTL_MS;
    private recordConsent;
    getConsentTypes(): Promise<{
        id: string;
        consent_code: string;
        description: string;
        version: number;
    }[]>;
    listApplications(query: ListApplicationsQueryDto): Promise<{
        items: ApplicationListItemDto[];
        page: number;
        limit: number;
        total: number;
    }>;
    create(dto: CreateApplicationDto, userId: string, correlationId?: string, context?: {
        ip?: string;
        userAgent?: string;
    }): Promise<{
        application_id: string;
        current_state: string;
    }>;
    update(id: string, dto: UpdateApplicationDto, userId: string, correlationId?: string): Promise<{
        application_id: string;
        current_state: string;
    }>;
    addConsent(applicationId: string, dto: ConsentDto, userId: string, correlationId?: string): Promise<{
        status: string;
    }>;
    submit(applicationId: string, userId: string, roleId: string | undefined, correlationId?: string): Promise<{
        application_id: string;
        current_state: string;
    }>;
    findDuplicates(applicationId: string): Promise<{
        duplicate_flag: boolean;
        matched_application_ids: string[];
    }>;
}
