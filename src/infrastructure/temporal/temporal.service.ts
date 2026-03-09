import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Client,
  Connection,
  WorkflowHandle,
  WorkflowOptions,
} from '@temporalio/client';

export interface StartWorkflowOptions extends WorkflowOptions {
  args?: unknown[];
}

@Injectable()
export class TemporalService implements OnModuleDestroy {
  private connection: Connection | null = null;
  private client: Client | null = null;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit(): Promise<void> {
    const address = this.config.get<string>('TEMPORAL_ADDRESS', 'temporal:7233');
    const namespace = this.config.get<string>('TEMPORAL_NAMESPACE', 'default');

    this.connection = await Connection.connect({
      address,
    });
    this.client = new Client({
      connection: this.connection,
      namespace,
    });
  }

  async onModuleDestroy(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
      this.connection = null;
      this.client = null;
    }
  }

  /**
   * Start a workflow by type name. Returns a handle to the workflow run.
   */
  async startWorkflow(
    workflowType: string,
    options: StartWorkflowOptions,
  ): Promise<WorkflowHandle> {
    if (!this.client) throw new Error('Temporal client not connected');

    const { args = [], ...workflowOptions } = options;
    return this.client.workflow.start(workflowType, {
      ...workflowOptions,
      args,
    });
  }

  /**
   * Get the underlying Temporal client for advanced usage.
   */
  getClient(): Client {
    if (!this.client) throw new Error('Temporal client not connected');
    return this.client;
  }
}
