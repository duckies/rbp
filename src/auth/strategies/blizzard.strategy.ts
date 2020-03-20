import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-bnet';
import { ConfigService } from '../../config/config.service';
import { User } from '../../user/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class BlizzardStrategy extends PassportStrategy(Strategy, 'blizzard') {
  private readonly logger: Logger = new Logger(BlizzardStrategy.name);

  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {
    super({
      clientID: configService.get('BLIZZARD_CLIENTID'),
      clientSecret: configService.get('BLIZZARD_SECRET'),
      callbackURL: configService.get('BLIZZARD_CALLBACK'),
      passReqToCallback: true,
      scope: ['wow.profile'],
    });
  }

  // Blizzard does not provide refresh tokens.
  async validate(req, accessToken, refreshToken, profile): Promise<void | User> {
    if (!req.user) {
      this.logger.log(`Logging in or creating ${profile.battletag}`);

      return await this.authService.validateDiscordLogin(accessToken, refreshToken, profile);
    }

    this.logger.log(`User ${req.user.id} is already logged in.`);
  }
}
