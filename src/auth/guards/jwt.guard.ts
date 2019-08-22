import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Authentication layer of the API by JWT.
 * TODO: Extend to provide blacklisting and whitelisting functionality.
 */
@Injectable()
export class JWTGuard extends AuthGuard('JWT') {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    try {
      return await super.canActivate(ctx) as boolean;
    } catch(e) {
      throw new UnauthorizedException();
    }
  }
}