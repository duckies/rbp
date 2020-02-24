import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Usr } from '../user/user.decorator';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

<<<<<<< HEAD
=======
  @Get('/discord')
  @UseGuards(AuthGuard('discord'))
  discordLogin(@Usr() user: User): User {
    return user;
  }

  @Get('/discord/callback')
  @UseGuards(AuthGuard('discord'))
  discordCallback(@Usr() user: User): { user: User; token: string } {
    const token = this.authService.signToken(user);

    return {
      user,
      token,
    };
  }

>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
  @Get('blizzard/login')
  @UseGuards(AuthGuard('blizzard'))
  blizzardLogin(@Usr() user: User): User {
    return user;
  }

  @Post('blizzard/callback')
  @UseGuards(AuthGuard('blizzard'))
  blizzardCallback(@Usr() user: User): { user: User; token: string } {
    const token = this.authService.signToken(user);

    return {
      user,
      token,
    };
  }
}
