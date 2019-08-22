import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { BlizzardStrategy } from './strategies/blizzard.strategy';
import { JWTGuard } from './guards/jwt.guard';
import { ComposeGuard } from './guards/compose.guard';
import { ACGuard } from 'nest-access-control';
import { ControlGuard } from './guards/control.guard';

@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [
    JwtStrategy,
    BlizzardStrategy,
    AuthService,
    JWTGuard,
    ACGuard,
    ControlGuard,
    ComposeGuard,
  ],
  controllers: [AuthController],
  exports: [
    AuthService,
    JwtStrategy,
    BlizzardStrategy,
    JWTGuard,
    ACGuard,
    ControlGuard,
    ComposeGuard,
  ],
})
export class AuthModule {}
