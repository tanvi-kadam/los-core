import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject, IsIn } from 'class-validator';

export class ApprovalDecisionDto {
  @ApiProperty({ description: 'Decision', enum: ['APPROVED', 'REJECTED'] })
  @IsString()
  @IsIn(['APPROVED', 'REJECTED'])
  decision: string;

  @ApiPropertyOptional({ description: 'Authority snapshot' })
  @IsOptional()
  @IsObject()
  authoritySnapshot?: Record<string, unknown>;
}
