import { Module, Global } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import { REDIS_CLIENT } from "./redis.constants";
import { RedisService } from "./redis.service";

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService): Redis => {
        const host = config.get<string>("REDIS_HOST", "redis");
        const port = config.get<number>("REDIS_PORT", 6379);
        const password = config.get<string>(
          "REDIS_PASSWORD",
          "IlM3x9C7I6Bw7QsjB70s8TTFCfanwPKQxqFnUii0",
        );
        return new Redis({
          host,
          port,
          ...(password && { password }),
          maxRetriesPerRequest: 3,
          retryStrategy: (times: number) =>
            times <= 3 ? Math.min(times * 100, 3000) : null,
          lazyConnect: true,
        });
      },
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
