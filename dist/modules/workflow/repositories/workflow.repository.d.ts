import { Repository } from 'typeorm';
import { ApplicationStateTransition } from '../entities/application-state-transition.entity';
export declare class WorkflowRepository {
    private readonly repo;
    constructor(repo: Repository<ApplicationStateTransition>);
    save(entity: Partial<ApplicationStateTransition>): Promise<ApplicationStateTransition>;
}
