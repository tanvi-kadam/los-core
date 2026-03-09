import { OnModuleDestroy } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { KafkaEventInput } from './kafka.types';
export declare class KafkaProducerService implements OnModuleDestroy {
    private readonly kafka;
    private producer;
    constructor(kafka: Kafka);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    send(topic: string, event: KafkaEventInput): Promise<void>;
}
