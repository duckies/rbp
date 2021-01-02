import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Timeout } from '@nestjs/schedule';
import { TokenService } from './services/token.service';

@Injectable()
export class BlizzardScheduler {
  constructor(
    private readonly tokenService: TokenService,
    private readonly config: ConfigService,
  ) {}

  @Timeout(1000)
  async getToken() {
    // The testing framework should not attempt to true authentication.
    if (this.config.get('NODE_ENV') === 'test') return;

    return this.tokenService.getToken();
  }
}
