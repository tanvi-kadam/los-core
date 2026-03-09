export declare class AmlRiskProfile {
    id: string;
    applicationId: string;
    entityRiskScore: number;
    directorRiskScore: number;
    structuralRiskScore: number;
    jurisdictionRiskScore: number;
    compositeScore: number;
    riskBand: string;
    computedAt: Date;
    modelVersion: string | null;
}
