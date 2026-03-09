import { UserRole } from './user-role.entity';
export declare class Role {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    userRoles: UserRole[];
}
