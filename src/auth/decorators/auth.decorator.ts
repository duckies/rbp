import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Role } from 'nest-access-control';
import { ControlGuard, JWTGuard } from '../guards';

export function Auth(...roles: Role[]) {
  return applyDecorators(SetMetadata('roles', roles), UseGuards(JWTGuard, ControlGuard));
}
