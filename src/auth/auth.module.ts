import { Global, Module } from '@nestjs/common';
import { ACGuard } from 'nest-access-control';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessControlGuard } from './guards/compose.guard';
import { ControlGuard } from './guards/control.guard';
import { JWTGuard } from './guards/jwt.guard';
import { OptionalAuthGuard } from './guards/optional.guard';
import { BlizzardStrategy } from './strategies/blizzard.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DiscordStrategy } from './strategies/discord.strategy';

@Global()
@Module({
  imports: [UserModule],
  providers: [
    JwtStrategy,
    BlizzardStrategy,
    DiscordStrategy,
    AuthService,
    JWTGuard,
    ACGuard,
    ControlGuard,
    AccessControlGuard,
    OptionalAuthGuard,
  ],
  controllers: [AuthController],
  exports: [
    AuthService,
    JwtStrategy,
    BlizzardStrategy,
    JWTGuard,
    ACGuard,
    ControlGuard,
    AccessControlGuard,
    OptionalAuthGuard,
  ],
})
export class AuthModule {}
