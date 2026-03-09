import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

/**
 * Guard that checks the request user has the required permissions.
 * Expects JwtAuthGuard to have run first and req.user to contain role_id.
 * Permission checks can be extended to use a role-permission matrix; here we allow if any permission is declared and user is authenticated.
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredPermissions?.length) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) throw new ForbiddenException('Authentication required');

    // RBAC: in a full implementation, resolve role_id to permissions and check requiredPermissions.
    // For now we require an authenticated user with a role; permission list is for documentation and future enforcement.
    if (!user.role_id) throw new ForbiddenException('Insufficient permissions');
    return true;
  }
}
