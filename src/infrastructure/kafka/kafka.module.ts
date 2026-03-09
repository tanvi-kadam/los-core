import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Kafka } from "kafkajs";
import { KAFKA_CLIENT } from "./kafka.constants";
import { KafkaProducerService } from "./kafka-producer.service";
import { KafkaConsumerService } from "./kafka-consumer.service";

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: KAFKA_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService): Kafka => {
        const brokers = config
          .get<string>("KAFKA_BROKERS", "152.67.7.3:9092")
          .split(",");
        return new Kafka({
          clientId: "los-core",
          brokers: brokers.map((b) => b.trim()),
        });
      },
    },
    KafkaProducerService,
    KafkaConsumerService,
  ],
  exports: [KafkaProducerService, KafkaConsumerService],
})
export class KafkaModule {}
