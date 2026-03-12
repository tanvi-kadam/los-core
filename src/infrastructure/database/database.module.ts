import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, type TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DatabaseService } from "./database.service";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => {
        // Print configuration values for checking
        const dbConfig: TypeOrmModuleOptions = {
          type: "postgres",
          host: config.get<string>("DB_HOST", "152.67.7.3"),
          port: config.get<number>("DB_PORT", 5432),
          username: config.get<string>("DB_USER", "los_admin"),
          password: config.get<string>(
            "DB_PASSWORD",
            "vlcMTwKDEftqjRUSgNOuwrBoEpZdm2KuIjz35sNu",
          ),
          database: config.get<string>("DB_NAME", "los_db"),
          autoLoadEntities: true,
          synchronize: config.get<string>("NODE_ENV") === "development",
          logging: config.get<string>("NODE_ENV") !== "production",
          // Multiple schemas: each entity declares its schema via @Entity({ schema: 'schema_name', name: 'table_name' })
        };
        // Only log non-sensitive config properties
        console.log("TypeORM Config:", {
          ...dbConfig,
          password: "*****", // mask password in console output
        });
        return dbConfig;
      },
    }),
  ],
  providers: [DatabaseService],
  exports: [TypeOrmModule, DatabaseService],
})
export class DatabaseModule {}
