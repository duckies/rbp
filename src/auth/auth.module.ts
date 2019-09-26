import { Global, Module } from '@nestjs/common';
import { ACGuard } from 'nest-access-control';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ComposeGuard } from './guards/compose.guard';
import { ControlGuard } from './guards/control.guard';
import { JWTGuard } from './guards/jwt.guard';
import { BlizzardStrategy } from './strategies/blizzard.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Global()
@Module({
  imports: [UserModule],
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
