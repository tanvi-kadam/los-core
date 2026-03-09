import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
export interface GetFileResult {
    body: Buffer;
    contentType?: string;
}
export declare class MinioService {
    private readonly client;
    private readonly bucket;
    constructor(client: S3Client, config: ConfigService);
    uploadFile(key: string, body: Buffer | Uint8Array | string, contentType?: string): Promise<void>;
    getFile(key: string): Promise<GetFileResult>;
    deleteFile(key: string): Promise<void>;
}
