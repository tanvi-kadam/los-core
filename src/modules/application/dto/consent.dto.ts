import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ConsentDto {
  @ApiProperty({ description: 'Consent type ID' })
  @IsUUID()
  consentTypeId: string;
}
