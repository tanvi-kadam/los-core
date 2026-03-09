import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateApprovalDto {
  @ApiProperty({ description: 'Object type (e.g. APPLICATION)' })
  @IsString()
  objectType: string;

  @ApiProperty({ description: 'Object ID' })
  @IsUUID()
  objectId: string;

  @ApiProperty({ description: 'Action type (e.g. SANCTION)' })
  @IsString()
  actionType: string;
}
