import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class ConsentDto {
  @ApiProperty({
    description: 'Consent code as configured in config_schema.consent_types',
    example: 'BUREAU_PULL',
  })
  @IsString()
  consentCode: string;

  @ApiProperty({
    description: 'Version of the consent text presented to the user',
    example: 1,
  })
  @IsInt()
  @Min(1)
  consentTextVersion: number;
}
