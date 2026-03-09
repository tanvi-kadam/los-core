import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity({ schema: 'aml_schema', name: 'aml_risk_profiles' })
export class AmlRiskProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'application_id', type: 'uuid' })
  applicationId: string;

  @Column({ name: 'entity_risk_score', type: 'integer' })
  entityRiskScore: number;

  @Column({ name: 'director_risk_score', type: 'integer' })
  directorRiskScore: number;

  @Column({ name: 'structural_risk_score', type: 'integer' })
  structuralRiskScore: number;

  @Column({ name: 'jurisdiction_risk_score', type: 'integer' })
  jurisdictionRiskScore: number;

  @Column({ name: 'composite_score', type: 'integer' })
  compositeScore: number;

  @Column({ name: 'risk_band', type: 'varchar', length: 50 })
  riskBand: string;

  @Column({ name: 'computed_at', type: 'timestamp' })
  computedAt: Date;

  @Column({ name: 'model_version', type: 'varchar', length: 50, nullable: true })
  modelVersion: string | null;
}
