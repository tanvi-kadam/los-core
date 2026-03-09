import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

/**
 * Declare required permissions for the route. Use with PermissionGuard.
 * @param permissions One or more permission codes (e.g. 'APPLICATION_CREATE')
 */
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
