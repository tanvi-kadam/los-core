/**
 * Infrastructure modules (database, redis, kafka, temporal, minio, logger, telemetry)
 * will be registered here. Domain modules must not directly access external systems.
 */

export { DatabaseModule, DatabaseService } from './database';
export { RedisModule, RedisService } from './redis';
export {
  KafkaModule,
  KafkaProducerService,
  KafkaConsumerService,
  type KafkaEvent,
  type KafkaEventInput,
  type KafkaMessageHandler,
} from './kafka';
export { TemporalModule, TemporalService, type StartWorkflowOptions } from './temporal';
export { MinioModule, MinioService, type GetFileResult } from './minio';
