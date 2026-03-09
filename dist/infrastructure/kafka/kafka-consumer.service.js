"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaConsumerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const kafkajs_1 = require("kafkajs");
const kafka_constants_1 = require("./kafka.constants");
let KafkaConsumerService = class KafkaConsumerService {
    constructor(kafka, config) {
        this.kafka = kafka;
        this.config = config;
        this.consumer = null;
        this.handlers = new Map();
        this.topics = [];
        this.running = false;
    }
    registerHandler(topic, handler) {
        if (this.running) {
            throw new Error('Cannot register handler after consumer has started');
        }
        this.handlers.set(topic, handler);
        if (!this.topics.includes(topic)) {
            this.topics.push(topic);
        }
    }
    async onApplicationBootstrap() {
        const groupId = this.config.get('KAFKA_CONSUMER_GROUP_ID');
        if (groupId)
            await this.start(groupId);
    }
    async start(groupId) {
        if (this.topics.length === 0)
            return;
        this.consumer = this.kafka.consumer({ groupId });
        await this.consumer.connect();
        await this.consumer.subscribe({ topics: this.topics, fromBeginning: false });
        this.running = true;
        await this.consumer.run({
            eachMessage: async (payload) => {
                const topic = payload.topic;
                const handler = this.handlers.get(topic);
                if (!handler)
                    return;
                const raw = payload.message.value?.toString();
                if (!raw)
                    return;
                try {
                    const event = JSON.parse(raw);
                    if (this.isValidEvent(event)) {
                        await handler(event);
                    }
                }
                catch {
                }
            },
        });
    }
    async onModuleDestroy() {
        if (this.consumer) {
            await this.consumer.disconnect();
            this.consumer = null;
        }
        this.running = false;
    }
    isValidEvent(value) {
        return (typeof value === 'object' &&
            value !== null &&
            'event_id' in value &&
            'event_type' in value &&
            'correlation_id' in value &&
            'payload' in value);
    }
};
exports.KafkaConsumerService = KafkaConsumerService;
exports.KafkaConsumerService = KafkaConsumerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(kafka_constants_1.KAFKA_CLIENT)),
    __metadata("design:paramtypes", [kafkajs_1.Kafka,
        config_1.ConfigService])
], KafkaConsumerService);
//# sourceMappingURL=kafka-consumer.service.js.map