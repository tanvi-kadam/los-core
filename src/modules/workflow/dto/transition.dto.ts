import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TransitionDto {
  @ApiProperty({ example: 'SUBMITTED', description: 'Target state' })
  @IsString()
  target_state: string;
}
