// src/system/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export enum Role {
  ADMIN = 'ADMIN',
  RESIDENT = 'RESIDENT',
  MANAGER = 'MANAGER',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
