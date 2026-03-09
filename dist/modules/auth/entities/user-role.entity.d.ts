import { User } from './user.entity';
import { Role } from './role.entity';
export declare class UserRole {
    id: string;
    userId: string;
    roleId: string;
    assignedAt: Date;
    user: User;
    role: Role;
}
