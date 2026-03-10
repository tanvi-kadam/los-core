import { OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Client, WorkflowHandle, WorkflowOptions } from "@temporalio/client";
export interface StartWorkflowOptions extends WorkflowOptions {
    args?: unknown[];
}
export declare class TemporalService implements OnModuleDestroy {
    private readonly config;
    private connection;
    private client;
    constructor(config: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    startWorkflow(workflowType: string, options: StartWorkflowOptions): Promise<WorkflowHandle>;
    getClient(): Client;
}
