import { ApiProperty } from '@nestjs/swagger';

export class ApplicationStateTransitionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  application_id: string;

  @ApiProperty()
  from_state: string;

  @ApiProperty()
  to_state: string;

  @ApiProperty()
  triggered_by: string;

  @ApiProperty()
  triggered_role: string;

  @ApiProperty({ required: false, nullable: true, type: Object })
  authority_snapshot: Record<string, unknown> | null;

  @ApiProperty({ required: false, nullable: true })
  correlation_id: string | null;

  @ApiProperty()
  occurred_at: Date;
}

