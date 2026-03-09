export declare class IdempotencyKey {
    id: string;
    idempotencyKey: string;
    endpoint: string;
    userId: string | null;
    requestHash: string;
    responseSnapshot: Record<string, unknown>;
    status: string;
    expiresAt: Date;
    createdAt: Date;
}
