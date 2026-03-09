import { Injectable, NotFoundException } from '@nestjs/common';
import { AmlRiskProfileRepository } from './repositories/aml-risk-profile.repository';
import { ApplicationRepository } from '../application/repositories/application.repository';
import { KafkaProducerService } from '../../infrastructure/kafka';
import { KAFKA_TOPICS } from '../../common/constants/kafka-topics';

const MODEL_VERSION = 'v1.0';

function scoreToBand(score: number): string {
  if (score <= 25) return 'LOW';
  if (score <= 50) return 'MEDIUM';
  if (score <= 75) return 'HIGH';
  return 'CRITICAL';
}

@Injectable()
export class AmlService {
  constructor(
    private readonly amlRiskProfileRepository: AmlRiskProfileRepository,
    private readonly applicationRepository: ApplicationRepository,
    private readonly kafkaProducer: KafkaProducerService,
  ) {}

  async compute(
    applicationId: string,
    correlationId?: string,
  ): Promise<{ risk_band: string; composite_score: number }> {
    const app = await this.applicationRepository.findById(applicationId);
    if (!app) throw new NotFoundException('Application not found');

    // Stub scoring: in production this would run AML model
    const entityRiskScore = Math.floor(Math.random() * 40) + 10;
    const directorRiskScore = Math.floor(Math.random() * 30) + 5;
    const structuralRiskScore = Math.floor(Math.random() * 25) + 5;
    const jurisdictionRiskScore = Math.floor(Math.random() * 20) + 5;
    const compositeScore = Math.min(
      100,
      Math.round(
        (entityRiskScore * 0.35 +
          directorRiskScore * 0.25 +
          structuralRiskScore * 0.25 +
          jurisdictionRiskScore * 0.15),
      ),
    );
    const riskBand = scoreToBand(compositeScore);

    await this.amlRiskProfileRepository.save({
      applicationId,
      entityRiskScore,
      directorRiskScore,
      structuralRiskScore,
      jurisdictionRiskScore,
      compositeScore,
      riskBand,
      computedAt: new Date(),
      modelVersion: MODEL_VERSION,
    });

    await this.kafkaProducer.send(KAFKA_TOPICS.AML_EVENTS, {
      event_type: 'AMLProfileGenerated',
      correlation_id: correlationId ?? '',
      payload: {
        application_id: applicationId,
        risk_band: riskBand,
        composite_score: compositeScore,
        model_version: MODEL_VERSION,
      },
    });

    return { risk_band: riskBand, composite_score: compositeScore };
  }
}
