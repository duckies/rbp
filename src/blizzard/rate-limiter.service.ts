import { HttpService, Injectable } from '@nestjs/common';
import { TokenService } from './token.service';
import { User } from '../user/user.entity';
import PQueue from 'p-queue';

@Injectable()
export class RateLimiter {
  public readonly blizzard: PQueue;

  constructor(private readonly http: HttpService, private readonly tokenService: TokenService) {
    this.blizzard = new PQueue({
      autoStart: true,
      intervalCap: 100,
      interval: 1000,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getBlizzard(uri: string, user?: User): Promise<any> {
    // try {
    await this.tokenService.getToken();

    const config = user
      ? {
          headers: { Authorization: `Bearer ${user.blizzardtoken}` },
        }
      : null;

    return (
      await this.blizzard.add(() => this.http.get(uri + '?namespace=profile-us&locale=en_US', config).toPromise())
    ).data;
    // } catch (error) {
    //   return error;
    // }
  }
}
