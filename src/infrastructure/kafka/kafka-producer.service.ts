import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { randomUUID } from 'crypto';
import { KAFKA_CLIENT } from './kafka.constants';
import { KafkaEvent, KafkaEventInput } from './kafka.types';

@Injectable()
export class KafkaProducerService implements OnModuleDestroy {
  private producer: Producer | null = null;

  constructor(
    @Inject(KAFKA_CLIENT)
    private readonly kafka: Kafka,
  ) {}

  async onModuleInit(): Promise<void> {
    this.producer = this.kafka.producer();
    await this.producer.connect();
  }

  async onModuleDestroy(): Promise<void> {
    if (this.producer) {
      await this.producer.disconnect();
      this.producer = null;
    }
  }

  /**
   * Send an event to a topic. event_id is generated if not provided.
   */
  async send(topic: string, event: KafkaEventInput): Promise<void> {
    if (!this.producer) throw new Error('Kafka producer not connected');

    const fullEvent: KafkaEvent = {
      ...event,
      event_id: event.event_id ?? randomUUID(),
    };

    await this.producer.send({
      topic,
      messages: [
        {
          key: fullEvent.event_id,
          value: JSON.stringify(fullEvent),
          headers: {
            event_type: fullEvent.event_type,
            correlation_id: fullEvent.correlation_id,
          },
        },
      ],
    });
  }
}
