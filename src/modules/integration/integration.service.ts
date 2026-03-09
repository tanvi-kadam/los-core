import { Injectable, NotFoundException } from '@nestjs/common';
import { EntitySnapshotRepository } from './repositories/entity-snapshot.repository';
import { ApplicationRepository } from '../application/repositories/application.repository';

@Injectable()
export class IntegrationService {
  constructor(
    private readonly entitySnapshotRepository: EntitySnapshotRepository,
    private readonly applicationRepository: ApplicationRepository,
  ) {}

  async mcaPull(
    applicationId: string,
    correlationId?: string,
  ): Promise<{
    application_id: string;
    mca_reference_id: string | null;
    legal_name: string | null;
    snapshot_version: number;
    pulled_at: string;
  }> {
    const app = await this.applicationRepository.findById(applicationId);
    if (!app) throw new NotFoundException('Application not found');

    const latest = await this.entitySnapshotRepository.findLatestByApplication(applicationId);
    const nextVersion = latest ? latest.snapshotVersion + 1 : 1;

    // Stub: in production this would call MCA API. Here we persist a placeholder snapshot.
    const rawResponse: Record<string, unknown> = {
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
}
