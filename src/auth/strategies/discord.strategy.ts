import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-discord';
import { ConfigService } from '../../config/config.service';
import { User } from '../../user/user.entity';
import { AuthService, DiscordProfile } from '../auth.service';
import { BlizzardStrategy } from './blizzard.strategy';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  private readonly logger: Logger = new Logger(BlizzardStrategy.name);

  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {
    super({
      clientID: configService.get('DISCORD_CLIENTID'),
      clientSecret: configService.get('DISCORD_SECRET'),
      callbackURL: configService.get('DISCORD_CALLBACK'),
      scope: ['identify'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: DiscordProfile): Promise<User> {
    console.log(accessToken, refreshToken, profile);
    this.logger.log(`Logging in or creating ${profile.username}`);

    return await this.authService.validateDiscordLogin(accessToken, refreshToken, profile);
  }
}
