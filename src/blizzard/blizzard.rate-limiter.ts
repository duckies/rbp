import { BadGatewayException, HttpException, HttpService, Injectable } from '@nestjs/common';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import PQueue from 'p-queue';
import { User } from '../user/user.entity';
import { TokenService } from './services/token.service';

@Injectable()
export class RateLimiter {
  public readonly blizzard: PQueue;

  constructor(
    private readonly http: HttpService,
    private readonly tokenService: TokenService,
    @InjectSentry() private readonly sentry: SentryService,
  ) {
    this.blizzard = new PQueue({
      autoStart: true,
      intervalCap: 100,
      interval: 1000,
    });
  }

  async getBlizzard(uri: string, user?: User): Promise<any> {
    try {
      await this.tokenService.getToken();

      const config = user
        ? {
            headers: { Authorization: `Bearer ${user.blizzard_token}` },
          }
        : null;

      return (
        await this.blizzard.add(() =>
          this.http.get(uri + '?namespace=profile-us&locale=en_US', config).toPromise(),
        )
      ).data;
    } catch (error) {
      this.sentry.instance().captureException(error);

      if (error.response) {
        throw new HttpException(error.response.data, error.response.status);
      }

      throw new BadGatewayException(error);
    }
  }
}
