import {
  BadGatewayException,
  HttpException,
  HttpService,
  Injectable,
} from '@nestjs/common';
import PQueue from 'p-queue';
import { TokenService } from './services/token.service';

@Injectable()
export class BlizzardService {
  private readonly queue: PQueue;

  constructor(
    private readonly http: HttpService,
    private readonly tokenService: TokenService,
  ) {
    this.queue = new PQueue({
      autoStart: true,
      intervalCap: 100,
      interval: 1000,
    });
  }

  getData<T>(endpoint: string, headers?: Record<string, string>) {
    return this.get<T>(
      `https://us.api.blizzard.com/data/wow${endpoint}?namespace=static-us&locale=en_US`,
      headers,
    );
  }

  getProfile<T>(endpoint: string, headers?: Record<string, string>) {
    return this.get<T>(
      `https://us.api.blizzard.com${endpoint}?namespace=profile-us&locale=en_US`,
      headers,
    );
  }

  async get<T>(url: string, headers?: Record<string, string>) {
    const request = async () => {
      await this.tokenService.getToken();

      return this.http
        .get<T>(url, { headers })
        .toPromise();
    };

    try {
      return await this.queue.add(request);
    } catch (error) {
      if (error.response) {
        throw new HttpException(error.response.data, error.response.status);
      }

      console.error(error);

      throw new BadGatewayException(error);
    }
  }
}
