"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinioModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const minio_constants_1 = require("./minio.constants");
const minio_service_1 = require("./minio.service");
let MinioModule = class MinioModule {
};
exports.MinioModule = MinioModule;
exports.MinioModule = MinioModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [
            {
                provide: minio_constants_1.S3_CLIENT,
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const endpoint = config.get('MINIO_ENDPOINT', 'http://minio:9000');
                    const accessKey = config.get('MINIO_ACCESS_KEY', '');
                    const secretKey = config.get('MINIO_SECRET_KEY', '');
                    return new client_s3_1.S3Client({
                        endpoint,
                        region: config.get('MINIO_REGION', 'us-east-1'),
                        credentials: accessKey && secretKey ? { accessKeyId: accessKey, secretAccessKey: secretKey } : undefined,
                        forcePathStyle: true,
                    });
                },
            },
            minio_service_1.MinioService,
        ],
        exports: [minio_service_1.MinioService],
    })
], MinioModule);
//# sourceMappingURL=minio.module.js.map