import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { S3_CLIENT } from './minio.constants';

export interface GetFileResult {
  body: Buffer;
  contentType?: string;
}

@Injectable()
export class MinioService {
  private readonly bucket: string;

  constructor(
    @Inject(S3_CLIENT)
    private readonly client: S3Client,
    config: ConfigService,
  ) {
    this.bucket = config.get<string>('MINIO_BUCKET', 'los');
  }

  /**
   * Upload a file to MinIO.
   */
  async uploadFile(
    key: string,
    body: Buffer | Uint8Array | string,
    contentType?: string,
  ): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: typeof body === 'string' ? Buffer.from(body, 'utf-8') : body,
      ...(contentType && { ContentType: contentType }),
    });
    await this.client.send(command);
  }

  /**
   * Get a file from MinIO. Returns body and optional contentType.
   * @throws if the object does not exist
   */
  async getFile(key: string): Promise<GetFileResult> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    const response = await this.client.send(command);
    const body = response.Body;
    if (!body) throw new Error(`Object not found: ${key}`);
    const bytes = await body.transformToByteArray();
    return {
      body: Buffer.from(bytes),
      contentType: response.ContentType,
    };
  }

  /**
   * Delete a file from MinIO.
   */
  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    await this.client.send(command);
  }
}
