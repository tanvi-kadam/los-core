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
exports.MinioService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const minio_constants_1 = require("./minio.constants");
let MinioService = class MinioService {
    constructor(client, config) {
        this.client = client;
        this.bucket = config.get('MINIO_BUCKET', 'los');
    }
    async uploadFile(key, body, contentType) {
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: typeof body === 'string' ? Buffer.from(body, 'utf-8') : body,
            ...(contentType && { ContentType: contentType }),
        });
        await this.client.send(command);
    }
    async getFile(key) {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });
        const response = await this.client.send(command);
        const body = response.Body;
        if (!body)
            throw new Error(`Object not found: ${key}`);
        const bytes = await body.transformToByteArray();
        return {
            body: Buffer.from(bytes),
            contentType: response.ContentType,
        };
    }
    async deleteFile(key) {
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });
        await this.client.send(command);
    }
};
exports.MinioService = MinioService;
exports.MinioService = MinioService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(minio_constants_1.S3_CLIENT)),
    __metadata("design:paramtypes", [client_s3_1.S3Client,
        config_1.ConfigService])
], MinioService);
//# sourceMappingURL=minio.service.js.map