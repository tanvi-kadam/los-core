"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const database_service_1 = require("./database.service");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const dbConfig = {
                        type: "postgres",
                        host: config.get("DB_HOST", "152.67.7.3"),
                        port: config.get("DB_PORT", 5432),
                        username: config.get("DB_USER", "los_admin"),
                        password: config.get("DB_PASSWORD", "vlcMTwKDEftqjRUSgNOuwrBoEpZdm2KuIjz35sNu"),
                        database: config.get("DB_NAME", "los_db"),
                        autoLoadEntities: true,
                        synchronize: config.get("NODE_ENV") === "development",
                        logging: config.get("NODE_ENV") !== "production",
                    };
                    console.log("TypeORM Config:", {
                        ...dbConfig,
                        password: "*****",
                    });
                    return dbConfig;
                },
            }),
        ],
        providers: [database_service_1.DatabaseService],
        exports: [typeorm_1.TypeOrmModule, database_service_1.DatabaseService],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map