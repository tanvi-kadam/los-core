import { ApplicationRepository } from './repositories/application.repository';
import { ConsentRecordRepository } from './repositories/consent-record.repository';
import { ConsentTypeRepository } from './repositories/consent-type.repository';
import { DuplicateCheckRepository } from './repositories/duplicate-check.repository';
import { AuditService } from '../audit/audit.service';
import { KafkaProducerService } from '../../infrastructure/kafka';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ConsentDto } from './dto/consent.dto';
export declare class ApplicationService {
    private readonly applicationRepository;
    private readonly consentRecordRepository;
    private readonly consentTypeRepository;
    private readonly duplicateCheckRepository;
    private readonly auditService;
    private readonly kafkaProducer;
    constructor(applicationRepository: ApplicationRepository, consentRecordRepository: ConsentRecordRepository, consentTypeRepository: ConsentTypeRepository, duplicateCheckRepository: DuplicateCheckRepository, auditService: AuditService, kafkaProducer: KafkaProducerService);
    create(dto: CreateApplicationDto, userId: string, correlationId?: string): Promise<{
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
    submit(applicationId: string, userId: string, correlationId?: string): Promise<{
        application_id: string;
        current_state: string;
    }>;
}
