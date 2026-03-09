import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsObject, IsOptional, IsUUID, IsDateString } from 'class-validator';

export class CreateConfigDto {
  @ApiProperty({ description: 'Config type/category' })
  @IsString()
  configType: string;

  @ApiProperty({ description: 'Config key' })
  @IsString()
  configKey: string;

  @ApiProperty({ description: 'Config value (JSON)' })
  @IsObject()
  configValue: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Effective from (ISO date)' })
  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;

  @ApiPropertyOptional({ description: 'Approver user ID' })
  @IsOptional()
  @IsUUID()
  approvedBy?: string | null;
}
