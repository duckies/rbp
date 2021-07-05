import { Inject, Injectable } from '@nestjs/common';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import PQueue, { DefaultAddOptions, Options } from 'p-queue';
import PriorityQueue from 'p-queue/dist/priority-queue';
import { AXIOS_INSTANCE_TOKEN } from './http.constants';

export type AxiosRetryConfig = AxiosRequestConfig & { retries: number };

@Injectable()
export class HttpService {
  private queue: PQueue = undefined;

  constructor(
    @Inject(AXIOS_INSTANCE_TOKEN)
    public readonly instance: AxiosInstance,
  ) {}

  private async wrap<T>(p: Promise<T>) {
    if (!this.queue) return p;

    return this.queue.add(async () => await p);
  }

  public setLimits(options?: Options<PriorityQueue, DefaultAddOptions>) {
    this.queue = new PQueue(options);
  }

  public async get<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.wrap(this.instance.get<T>(url, config));
  }

  public async $get<T = any>(url: string, config?: AxiosRequestConfig) {
    return (await this.wrap(this.instance.get<T>(url, config))).data;
  }

  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ) {
    return this.wrap(this.instance.post<T>(url, data, config));
  }

  public async $post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ) {
    return (await this.wrap(this.instance.post<T>(url, data, config))).data;
  }

  public async request<T = any>(config: AxiosRequestConfig) {
    return this.wrap(this.instance.request<T>(config));
  }
}
