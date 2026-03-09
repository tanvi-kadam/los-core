export declare class AuditLog {
    id: string;
    actorId: string;
    actorRole: string;
    authoritySnapshot: Record<string, unknown> | null;
    actionType: string;
    objectType: string;
    objectId: string | null;
    beforeStateHash: string | null;
    afterStateHash: string | null;
    occurredAt: Date;
    correlationId: string | null;
}
