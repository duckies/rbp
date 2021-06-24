import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  AXIOS_INSTANCE_TOKEN,
  AXIOS_RETRY_LIMIT,
  HTTP_ENVIRONMENT_TOKEN,
} from '../http.constants';
import { AxiosRetryConfig } from '../http.service';
import { CredentialBuffer } from '../token/token-buffer.class';
import { Token } from '../token/token.class';
import { OAuthEnvironment } from './oauth.environment';

@Injectable()
export class OAuthStrategy {
  private readonly logger = new Logger(OAuthStrategy.name);
  private readonly buffer = new CredentialBuffer();
  private token: Token;

  constructor(
    @Inject(AXIOS_INSTANCE_TOKEN)
    private readonly axios: AxiosInstance,
    @Inject(AXIOS_RETRY_LIMIT)
    private readonly maxRetries: number,
    @Inject(HTTP_ENVIRONMENT_TOKEN)
    private readonly environment: OAuthEnvironment,
  ) {
    this.setup();
  }

  /**
   * Attaches the request and response interceptors to the
   * injected axios instance.
   */
  public setup() {
    this.axios.interceptors.request.use(this.onRequestIntercept.bind(this));
    this.axios.interceptors.response.use(
      null,
      this.onErrorIntercept.bind(this),
    );
  }

  /**
   * Attempts to retrieve authorization credentials for the given environment
   * and create a new token.
   */
  public async getAccessToken() {
    this.buffer.lock();

    try {
      const response = await this.axios.request(
        this.environment.getAuthRequestConfig(),
      );

      this.token = new Token(response.data);
      this.logger.log(`Token generated for ${this.environment.name}`);

      this.buffer.flush();
      this.buffer.unlock();

      return this.token;
    } catch (error) {
      this.token = null;
      this.buffer.flush(error);
      this.buffer.unlock();

      throw error;
    }
  }

  /**
   * Modifies an Axios request config by appending the authorization
   * credentials to the headers.
   *
   * @param config Axios request config.
   */
  public setConfigHeader(config: AxiosRequestConfig) {
    config.headers = config.headers || {};
    config.headers.Authorization = this.token.getAuthorizationString();

    return config;
  }

  /**
   * Retries an Axios request that failed due to invalid credentials.
   * This will initiate client credential flow if one isn't already pending.
   *
   * @param config Axios request config with retries.
   */
  private async retry(config: AxiosRetryConfig) {
    config.retries++;

    const promise = this.buffer
      .enqueue(config)
      .then(() => this.axios.request(this.setConfigHeader(config)));

    // If the buffer is not locked retrieve a new token.
    // If it is locked, one is already underway.
    if (!this.buffer.isLocked) {
      this.getAccessToken();
    }

    return promise;
  }

  /**
   * Intercepts an Axios request config and attaches the token credentials
   * if necessary.
   *
   * @param config Axios request config with retries.
   */
  public async onRequestIntercept(config: AxiosRetryConfig) {
    config.retries = config.retries || 0;

    if (config.headers.Authorization) return config;
    if (config.url === this.environment.tokenUrl) return config;

    if (this.buffer.isLocked) {
      await this.buffer.enqueue(config);
    } else if (!this.token?.isValid) {
      await Promise.all([this.buffer.enqueue(config), this.getAccessToken()]);
    }

    return this.setConfigHeader(config);
  }

  /**
   * Intercepts an Axios error, with or without a response. If the error
   * is authentication related, the request is retried.
   *
   * @param error Incoming error.
   */
  public async onErrorIntercept(error: any) {
    const config = error.config;

    if (!config) return Promise.reject(error);

    if (error?.response?.status === 401 && config.retries < this.maxRetries) {
      return this.retry(config);
    }

    throw new HttpException(
      error?.response?.data || 'Unexpected Http Error',
      error?.response?.status || 500,
    );
  }
}
