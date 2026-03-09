import {
  Inject,
  Injectable,
  OnApplicationBootstrap,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { KAFKA_CLIENT } from './kafka.constants';
import { KafkaEvent } from './kafka.types';

export type KafkaMessageHandler = (event: KafkaEvent) => Promise<void>;

@Injectable()
export class KafkaConsumerService implements OnApplicationBootstrap, OnModuleDestroy {
  private consumer: Consumer | null = null;
  private readonly handlers = new Map<string, KafkaMessageHandler>();
  private readonly topics: string[] = [];
  private running = false;

  constructor(
    @Inject(KAFKA_CLIENT)
    private readonly kafka: Kafka,
    private readonly config: ConfigService,
  ) {}

  /**
   * Register a handler for a topic. Call before the application starts consuming.
   */
  registerHandler(topic: string, handler: KafkaMessageHandler): void {
    if (this.running) {
      throw new Error('Cannot register handler after consumer has started');
    }
    this.handlers.set(topic, handler);
    if (!this.topics.includes(topic)) {
      this.topics.push(topic);
    }
  }

  async onApplicationBootstrap(): Promise<void> {
    const groupId = this.config.get<string>('KAFKA_CONSUMER_GROUP_ID');
    if (groupId) await this.start(groupId);
  }

  async start(groupId: string): Promise<void> {
    if (this.topics.length === 0) return;

    this.consumer = this.kafka.consumer({ groupId });
    await this.consumer.connect();
    await this.consumer.subscribe({ topics: this.topics, fromBeginning: false });

    this.running = true;
    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        const topic = payload.topic;
        const handler = this.handlers.get(topic);
        if (!handler) return;

        const raw = payload.message.value?.toString();
        if (!raw) return;

        try {
          const event = JSON.parse(raw) as KafkaEvent;
          if (this.isValidEvent(event)) {
            await handler(event);
          }
        } catch {
          // Log and skip invalid messages
        }
      },
    });
  }

  async onModuleDestroy(): Promise<void> {
    if (this.consumer) {
      await this.consumer.disconnect();
      this.consumer = null;
    }
    this.running = false;
  }

  private isValidEvent(value: unknown): value is KafkaEvent {
    return (
      typeof value === 'object' &&
      value !== null &&
      'event_id' in value &&
      'event_type' in value &&
      'correlation_id' in value &&
      'payload' in value
    );
  }
}
