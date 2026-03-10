import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ConsentDto } from './consent.dto';

export class CreateApplicationDto {
  @ApiProperty({ example: 'PRIVATE_LIMITED', description: 'Entity type' })
  @IsString()
  entityType: string;

  @ApiProperty({ example: 'U12345MH2020PTC123456', description: 'Entity identifier' })
  @IsString()
  entityIdentifier: string;

  @ApiProperty({ example: 'ABCDE1234F', description: 'PAN' })
  @IsString()
  pan: string;

  @ApiProperty({ example: 'TERM_LOAN', description: 'Product code' })
  @IsString()
  productCode: string;

  @ApiProperty({ example: 5000000, description: 'Loan amount' })
  @IsNumber()
  @Min(1)
  loanAmount: number;

  @ApiProperty({ example: 36, description: 'Loan tenure in months' })
  @IsNumber()
  @Min(1)
  loanTenureMonths: number;

  @ApiPropertyOptional({ example: 'Working capital', description: 'Purpose' })
  @IsOptional()
  @IsString()
  purpose?: string | null;

  @ApiPropertyOptional({
    description: 'Initial consents captured at application creation',
    type: () => [ConsentDto],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ConsentDto)
  consents?: ConsentDto[];
}
