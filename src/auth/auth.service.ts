import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '../config/config.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { JWTPayload } from './dto/jwt.dto';

export enum Provider {
  BLIZZARD = 'blizzard',
  DISCORD = 'discord',
}

export interface DiscordProfile {
  id: string;
  username: string;
  avatar?: string;
  discriminator: string;
  locale: string;
  mfa_enabled: boolean;
  flags?: number;
  premium_type?: number;
  provider: Provider.DISCORD;
  accessToken: string;
  fetchedAt: Date;
}

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async verify(payload: JWTPayload): Promise<User> {
    return await this.userService.findOneByJwtPayload(payload);
  }

  signToken(user: User): string {
    return sign({ id: user.id }, this.configService.get('JWT_SECRET'));
  }

  async validateDiscordLogin(accessToken: string, refreshToken: string, profile: DiscordProfile): Promise<User> {
    const user = await this.userService.findOneByProviderId(profile.id, profile.provider);

    if (!user) {
      return await this.userService.create(profile.id, accessToken, refreshToken, profile);
    }

    user.discord_access_token = accessToken;
    user.discord_refresh_token = refreshToken;
    user.discord_avatar = profile.avatar;
    user.discord_username = profile.username;
    user.discord_discriminator = profile.discriminator;

    return user.save();
  }
}
