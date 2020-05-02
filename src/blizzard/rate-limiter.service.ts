import {
  HttpService,
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
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
      switch (error.response.status) {
        case 404:
          throw new NotFoundException(error.response.data);

        case 400:
          throw new BadRequestException(error.response.data);

        case 401:
          // Check if user or not, then try to refresh the token
          throw new UnauthorizedException(error.response.data);

        default:
          console.error(error.response.status, error.response.data);
          throw new InternalServerErrorException(error.response.data);
      }
    }
  }
}
