import { ACGuard } from 'nest-access-control';
import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

/**
 * Override of the ACGuard provided by NestAccessControl
 * to provide a ForbiddenException upon its failure.
 */
@Injectable()
export class ControlGuard extends ACGuard {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    try {
      return await super.canActivate(ctx) as boolean;
    } catch(error) {
      throw new ForbiddenException();
    }
  }
}