import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'user_roles';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
