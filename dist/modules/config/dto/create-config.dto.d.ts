export declare class CreateConfigDto {
    configType: string;
    configKey: string;
    configValue: Record<string, unknown>;
    effectiveFrom?: string;
    approvedBy?: string | null;
}
