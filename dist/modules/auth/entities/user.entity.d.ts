import { UserRole } from './user-role.entity';
export declare class User {
    id: string;
    email: string;
    passwordHash: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    userRoles: UserRole[];
}
