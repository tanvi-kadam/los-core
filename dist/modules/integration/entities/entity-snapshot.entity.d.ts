export declare class EntitySnapshot {
    id: string;
    applicationId: string;
    mcaReferenceId: string | null;
    legalName: string | null;
    registrationNumber: string | null;
    incorporationDate: Date | null;
    companyStatus: string | null;
    companyType: string | null;
    registeredAddress: string | null;
    snapshotVersion: number;
    pulledAt: Date;
    rawResponse: Record<string, unknown> | null;
}
