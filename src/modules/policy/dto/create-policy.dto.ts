import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsDateString, IsNumber } from 'class-validator';

export class CreatePolicyDto {
  @ApiProperty({ description: 'Policy type' })
  @IsString()
  policyType: string;

  @ApiPropertyOptional({ description: 'Version number' })
  @IsOptional()
  @IsNumber()
  version?: number;

  @ApiPropertyOptional({ description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({ description: 'Effective from (ISO date)' })
  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;

  @ApiPropertyOptional({ description: 'Approver user ID' })
  @IsOptional()
  @IsUUID()
  approvedBy?: string | null;
}
