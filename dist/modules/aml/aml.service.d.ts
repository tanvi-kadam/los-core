import { AmlRiskProfileRepository } from './repositories/aml-risk-profile.repository';
import { ApplicationRepository } from '../application/repositories/application.repository';
import { KafkaProducerService } from '../../infrastructure/kafka';
export declare class AmlService {
    private readonly amlRiskProfileRepository;
    private readonly applicationRepository;
    private readonly kafkaProducer;
    constructor(amlRiskProfileRepository: AmlRiskProfileRepository, applicationRepository: ApplicationRepository, kafkaProducer: KafkaProducerService);
    compute(applicationId: string, correlationId?: string): Promise<{
        risk_band: string;
        composite_score: number;
    }>;
}
