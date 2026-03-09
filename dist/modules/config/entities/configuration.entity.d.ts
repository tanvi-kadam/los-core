export declare class Configuration {
    id: string;
    configType: string;
    configKey: string;
    configValue: Record<string, unknown>;
    version: number;
    effectiveFrom: Date;
    approvedBy: string | null;
    createdAt: Date;
}
