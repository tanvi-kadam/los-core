export interface HealthCheckResult {
    status: 'ok' | 'error';
    timestamp: string;
    uptime: number;
    environment: string;
}
export declare class HealthService {
    private readonly startTime;
    check(): HealthCheckResult;
}
