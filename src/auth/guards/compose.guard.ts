import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JWTGuard } from './jwt.guard';
import { ControlGuard } from './control.guard';

/**
 * Composite authentication and authorization guard.
 *
 * If the JWTGuard fails it returns an UnauthorizedException.
 * If the ControlGuard fails it returns a ForbiddenException.
 */
@Injectable()
export class ComposeGuard implements CanActivate {
  constructor(private jWTGuard: JWTGuard, private controlGuard: ControlGuard) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    return (await this.jWTGuard.canActivate(ctx)) && (await this.controlGuard.canActivate(ctx));
  }
}
