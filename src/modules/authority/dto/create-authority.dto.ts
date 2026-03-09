import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsOptional, IsArray, IsDateString, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAuthorityDto {
  @ApiProperty({ description: 'Role ID' })
  @IsUUID()
  role_id: string;

  @ApiProperty({ example: 1000000, description: 'Maximum loan amount' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  max_loan_amount: number;

  @ApiProperty({ example: 5, description: 'Maximum deviation percent', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  max_deviation_percent?: number;

  @ApiProperty({ example: ['WORKING_CAPITAL', 'TERM_LOAN'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowed_products?: string[];

  @ApiProperty({ example: ['IN', 'KE'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowed_geographies?: string[];

  @ApiProperty({ example: '2025-01-01T00:00:00Z' })
  @IsDateString()
  effective_from: string;

  @ApiProperty({ example: '2026-12-31T23:59:59Z', required: false })
  @IsOptional()
  @IsDateString()
  effective_to?: string;
}
