import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-discord';
import { ConfigService } from '../../config/config.service';
import { AuthService, DiscordProfile } from '../auth.service';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(
    private readonly authService: AuthService,
    config: ConfigService,
  ) {
    super({
      clientID: config.DISCORD.CLIENT_ID,
      clientSecret: config.DISCORD.SECRET_KEY,
      callbackURL: config.DISCORD.CALLBACK,
      scope: ['identify'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: DiscordProfile,
  ) {
    return this.authService.validateDiscordLogin(
      accessToken,
      refreshToken,
      profile,
    );
  }
}
