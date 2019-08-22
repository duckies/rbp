import { Controller, Get, UseGuards, UseFilters, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Usr } from "../user/user.decorator";
import { User } from "../user/user.entity";
import { AuthGuard } from "@nestjs/passport";
import { BlizzardExceptionFilter } from "../filters/blizzard.filter";
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('blizzard/login')
  @UseGuards(AuthGuard('blizzard'))
  blizzardLogin(@Usr() user: User) {
    return user;
  }

  @Get('blizzard/callback')
  @UseFilters(BlizzardExceptionFilter)
  @UseGuards(AuthGuard('blizzard'))
  blizzardCallback(@Usr() user: User, @Res() res: Response) {
    const token = this.authService.signToken(user);

    res.cookie('x-access-token', token);
    return res.redirect('http://localhost:8000')
  }
}