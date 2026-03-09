export declare class ApplicationStateTransition {
    id: string;
    applicationId: string;
    fromState: string;
    toState: string;
    triggeredBy: string;
    triggeredRole: string;
    authoritySnapshot: Record<string, unknown> | null;
    occurredAt: Date;
    correlationId: string | null;
}
