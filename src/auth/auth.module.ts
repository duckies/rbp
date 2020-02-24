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
<<<<<<< HEAD
=======
import { DiscordStrategy } from './strategies/discord.strategy';
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028

@Global()
@Module({
  imports: [UserModule],
  providers: [
    JwtStrategy,
    BlizzardStrategy,
<<<<<<< HEAD
=======
    DiscordStrategy,
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
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
