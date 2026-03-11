import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  Min,
  Max,
  IsOptional,
  IsString,
} from 'class-validator';

export class ListApplicationsQueryDto {
  @ApiProperty({ example: 1, description: 'Page number (1-based)' })
  @IsInt()
  @Min(1)
  page = 1;

  @ApiProperty({ example: 20, description: 'Page size' })
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;

  @ApiPropertyOptional({
    example: 'DRAFT',
    description: 'Filter by current application state',
  })
  @IsOptional()
  @IsString()
  state?: string;
}

export class ApplicationListItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  entity_type: string;

  @ApiProperty()
  entity_identifier: string;

  @ApiProperty()
  pan: string;

  @ApiProperty()
  product_code: string;

  @ApiProperty({ description: 'Loan amount as string (numeric)' })
  loan_amount: string;

  @ApiProperty()
  loan_tenure_months: number;

  @ApiProperty({ required: false, nullable: true })
  purpose: string | null;

  @ApiProperty()
  current_state: string;

  @ApiProperty()
  consent_status: string;

  @ApiProperty()
  duplicate_flag: boolean;

  @ApiProperty()
  created_by: string;

  @ApiProperty()
  created_at: Date;
}

