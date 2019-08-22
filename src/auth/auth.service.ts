import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { ConfigService } from '../config/config.service';
import { sign } from 'jsonwebtoken';

export enum Provider {
  BLIZZARD = 'blizzard',
}

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  verify(payload: any) {
    return this.userService.findOneByJwtPayload(payload);
  }

  signToken(user: User) {
    return sign({ id: user.id }, this.configService.get('JWT_SECRET'));
  }

  async validateOAuthLogin(
    thirdPartyId: number,
    accessToken: string,
    refreshToken: string,
    data: any,
    provider: Provider
  ): Promise<User> {
    try {
      const user = await this.userService.findOneByProviderId(thirdPartyId, provider);
      
      if (provider == Provider.BLIZZARD) {
        user.battletag = data.battletag;
        user.blizzardtoken = accessToken;

        return await user.save();
      }
    } catch (error) {
      if (error.name === "EntityNotFound") {
        const user = await this.userService.create(thirdPartyId, data.battletag, accessToken);
        user.justCreated = true;

        return user;
      }

      this.logger.error('User was not found or errored out. ' + JSON.stringify(error));
      return Promise.reject();
    }
  }
}
