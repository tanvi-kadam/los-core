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
exports.KafkaProducerService = void 0;
const common_1 = require("@nestjs/common");
const kafkajs_1 = require("kafkajs");
const crypto_1 = require("crypto");
const kafka_constants_1 = require("./kafka.constants");
let KafkaProducerService = class KafkaProducerService {
    constructor(kafka) {
        this.kafka = kafka;
        this.producer = null;
    }
    async onModuleInit() {
        this.producer = this.kafka.producer();
        await this.producer.connect();
    }
    async onModuleDestroy() {
        if (this.producer) {
            await this.producer.disconnect();
            this.producer = null;
        }
    }
    async send(topic, event) {
        if (!this.producer)
            throw new Error('Kafka producer not connected');
        const fullEvent = {
            ...event,
            event_id: event.event_id ?? (0, crypto_1.randomUUID)(),
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
};
exports.KafkaProducerService = KafkaProducerService;
exports.KafkaProducerService = KafkaProducerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(kafka_constants_1.KAFKA_CLIENT)),
    __metadata("design:paramtypes", [kafkajs_1.Kafka])
], KafkaProducerService);
//# sourceMappingURL=kafka-producer.service.js.map