import { Injectable } from '@nestjs/common';
import { NestSchedule, Timeout } from 'nest-schedule';
import { TokenService } from './token.service';

@Injectable()
export class BlizzardScheduler extends NestSchedule {
  constructor(private readonly tokenService: TokenService) {
    super();
  }

  @Timeout(1000)
  async getToken(): Promise<void> {
    await this.tokenService.getToken();
  }
}
