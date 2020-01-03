import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalAuthGuard extends AuthGuard('JWT') {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    try {
      return (await super.canActivate(ctx)) as boolean;
    } catch (error) {
      return true;
    }
  }
}
