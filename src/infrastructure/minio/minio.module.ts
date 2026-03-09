import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { S3_CLIENT } from './minio.constants';
import { MinioService } from './minio.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: S3_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService): S3Client => {
        const endpoint = config.get<string>('MINIO_ENDPOINT', 'http://minio:9000');
        const accessKey = config.get<string>('MINIO_ACCESS_KEY', '');
        const secretKey = config.get<string>('MINIO_SECRET_KEY', '');
        return new S3Client({
          endpoint,
          region: config.get<string>('MINIO_REGION', 'us-east-1'),
          credentials: accessKey && secretKey ? { accessKeyId: accessKey, secretAccessKey: secretKey } : undefined,
          forcePathStyle: true,
        });
      },
    },
    MinioService,
  ],
  exports: [MinioService],
})
export class MinioModule {}
