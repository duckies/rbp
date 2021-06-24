import { Injectable } from '@nestjs/common';
import PQueue from 'p-queue';
import { HttpService } from '../http/http.service';

@Injectable()
export class BlizzardService {
  private readonly queue: PQueue;

  constructor(private readonly http: HttpService) {
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
      `${endpoint}?namespace=profile-us&locale=en_US`,
      headers,
    );
  }

  get<T>(url: string, headers?: Record<string, string>) {
    return this.queue.add(async () => this.http.get<T>(url, { headers }));
  }
}
