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
exports.AmlService = void 0;
const common_1 = require("@nestjs/common");
const aml_risk_profile_repository_1 = require("./repositories/aml-risk-profile.repository");
const application_repository_1 = require("../application/repositories/application.repository");
const kafka_1 = require("../../infrastructure/kafka");
const kafka_topics_1 = require("../../common/constants/kafka-topics");
const MODEL_VERSION = 'v1.0';
function scoreToBand(score) {
    if (score <= 25)
        return 'LOW';
    if (score <= 50)
        return 'MEDIUM';
    if (score <= 75)
        return 'HIGH';
    return 'CRITICAL';
}
let AmlService = class AmlService {
    constructor(amlRiskProfileRepository, applicationRepository, kafkaProducer) {
        this.amlRiskProfileRepository = amlRiskProfileRepository;
        this.applicationRepository = applicationRepository;
        this.kafkaProducer = kafkaProducer;
    }
    async compute(applicationId, correlationId) {
        const app = await this.applicationRepository.findById(applicationId);
        if (!app)
            throw new common_1.NotFoundException('Application not found');
        const entityRiskScore = Math.floor(Math.random() * 40) + 10;
        const directorRiskScore = Math.floor(Math.random() * 30) + 5;
        const structuralRiskScore = Math.floor(Math.random() * 25) + 5;
        const jurisdictionRiskScore = Math.floor(Math.random() * 20) + 5;
        const compositeScore = Math.min(100, Math.round((entityRiskScore * 0.35 +
            directorRiskScore * 0.25 +
            structuralRiskScore * 0.25 +
            jurisdictionRiskScore * 0.15)));
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
        await this.kafkaProducer.send(kafka_topics_1.KAFKA_TOPICS.AML_EVENTS, {
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
};
exports.AmlService = AmlService;
exports.AmlService = AmlService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [aml_risk_profile_repository_1.AmlRiskProfileRepository,
        application_repository_1.ApplicationRepository,
        kafka_1.KafkaProducerService])
], AmlService);
//# sourceMappingURL=aml.service.js.map