import { EntitySnapshotRepository } from './repositories/entity-snapshot.repository';
import { ApplicationRepository } from '../application/repositories/application.repository';
export declare class IntegrationService {
    private readonly entitySnapshotRepository;
    private readonly applicationRepository;
    constructor(entitySnapshotRepository: EntitySnapshotRepository, applicationRepository: ApplicationRepository);
    mcaPull(applicationId: string, correlationId?: string): Promise<{
        application_id: string;
        mca_reference_id: string | null;
        legal_name: string | null;
        snapshot_version: number;
        pulled_at: string;
    }>;
}
