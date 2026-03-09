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
exports.IntegrationService = void 0;
const common_1 = require("@nestjs/common");
const entity_snapshot_repository_1 = require("./repositories/entity-snapshot.repository");
const application_repository_1 = require("../application/repositories/application.repository");
let IntegrationService = class IntegrationService {
    constructor(entitySnapshotRepository, applicationRepository) {
        this.entitySnapshotRepository = entitySnapshotRepository;
        this.applicationRepository = applicationRepository;
    }
    async mcaPull(applicationId, correlationId) {
        const app = await this.applicationRepository.findById(applicationId);
        if (!app)
            throw new common_1.NotFoundException('Application not found');
        const latest = await this.entitySnapshotRepository.findLatestByApplication(applicationId);
        const nextVersion = latest ? latest.snapshotVersion + 1 : 1;
        const rawResponse = {
            entity_identifier: app.entityIdentifier,
            source: 'mca_stub',
            correlation_id: correlationId,
        };
        const snapshot = await this.entitySnapshotRepository.save({
            applicationId,
            mcaReferenceId: app.entityIdentifier,
            legalName: null,
            registrationNumber: app.entityIdentifier,
            incorporationDate: null,
            companyStatus: null,
            companyType: app.entityType,
            registeredAddress: null,
            snapshotVersion: nextVersion,
            pulledAt: new Date(),
            rawResponse,
        });
        return {
            application_id: applicationId,
            mca_reference_id: snapshot.mcaReferenceId,
            legal_name: snapshot.legalName,
            snapshot_version: snapshot.snapshotVersion,
            pulled_at: snapshot.pulledAt.toISOString(),
        };
    }
};
exports.IntegrationService = IntegrationService;
exports.IntegrationService = IntegrationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [entity_snapshot_repository_1.EntitySnapshotRepository,
        application_repository_1.ApplicationRepository])
], IntegrationService);
//# sourceMappingURL=integration.service.js.map