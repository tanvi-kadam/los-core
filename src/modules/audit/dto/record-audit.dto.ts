import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional, IsObject } from 'class-validator';

export class RecordAuditDto {
  @ApiProperty({ description: 'Actor user ID' })
  @IsUUID()
  actorId: string;

  @ApiProperty({ description: 'Actor role' })
  @IsString()
  actorRole: string;

  @ApiPropertyOptional({ description: 'Authority snapshot at time of action' })
  @IsOptional()
  @IsObject()
  authoritySnapshot?: Record<string, unknown>;

  @ApiProperty({ description: 'Action type (e.g. CREATE, UPDATE, SUBMIT)' })
  @IsString()
  actionType: string;

  @ApiProperty({ description: 'Object type (e.g. APPLICATION, APPROVAL)' })
  @IsString()
  objectType: string;

  @ApiPropertyOptional({ description: 'Target object ID' })
  @IsOptional()
  @IsUUID()
  objectId?: string | null;

  @ApiPropertyOptional({ description: 'Hash of state before action' })
  @IsOptional()
  @IsString()
  beforeStateHash?: string | null;

  @ApiPropertyOptional({ description: 'Hash of state after action' })
  @IsOptional()
  @IsString()
  afterStateHash?: string | null;

  @ApiPropertyOptional({ description: 'Correlation ID' })
  @IsOptional()
  @IsString()
  correlationId?: string | null;
}
