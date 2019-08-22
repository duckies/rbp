import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-bnet';
import { AuthService, Provider } from '../auth.service';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class BlizzardStrategy extends PassportStrategy(Strategy, 'blizzard') {
  private readonly logger: Logger = new Logger(BlizzardStrategy.name);

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('BLIZZARD_CLIENTID'),
      clientSecret: configService.get('BLIZZARD_SECRET'),
      callbackURL: configService.get('BLIZZARD_CALLBACK'),
      passReqToCallback: true,
      scope: ['wow.profile'],
    });
  }

  // Blizzard does not provide refresh tokens.
  async validate(req, accessToken, refreshToken, profile) {
    if (!req.user) {
      this.logger.log('Logging in or creating user ' + JSON.stringify(profile));

      return await this.authService.validateOAuthLogin(
        profile.id,
        accessToken,
        refreshToken,
        profile,
        Provider.BLIZZARD,
      );
    }

    this.logger.log(`User ${req.user.id} is already logged in.`);
  }
}
