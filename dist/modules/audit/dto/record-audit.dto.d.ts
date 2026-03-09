export declare class RecordAuditDto {
    actorId: string;
    actorRole: string;
    authoritySnapshot?: Record<string, unknown>;
    actionType: string;
    objectType: string;
    objectId?: string | null;
    beforeStateHash?: string | null;
    afterStateHash?: string | null;
    correlationId?: string | null;
}
