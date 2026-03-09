import { OnApplicationBootstrap, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka } from 'kafkajs';
import { KafkaEvent } from './kafka.types';
export type KafkaMessageHandler = (event: KafkaEvent) => Promise<void>;
export declare class KafkaConsumerService implements OnApplicationBootstrap, OnModuleDestroy {
    private readonly kafka;
    private readonly config;
    private consumer;
    private readonly handlers;
    private readonly topics;
    private running;
    constructor(kafka: Kafka, config: ConfigService);
    registerHandler(topic: string, handler: KafkaMessageHandler): void;
    onApplicationBootstrap(): Promise<void>;
    start(groupId: string): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private isValidEvent;
}
