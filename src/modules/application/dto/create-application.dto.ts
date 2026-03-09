import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

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
  @Min(0)
  loanAmount: number;

  @ApiProperty({ example: 36, description: 'Loan tenure in months' })
  @IsNumber()
  @Min(1)
  loanTenureMonths: number;

  @ApiPropertyOptional({ example: 'Working capital', description: 'Purpose' })
  @IsOptional()
  @IsString()
  purpose?: string | null;
}
