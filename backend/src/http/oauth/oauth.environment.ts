import { AxiosRequestConfig } from 'axios';
import qs from 'qs';

export class OAuthEnvironment {
  constructor(
    public readonly name: string,
    private readonly clientId: string,
    private readonly clientSecret: string,
    public readonly tokenUrl: string,
  ) {}

  public getAuthorizationString() {
    const encoded = Buffer.from(
      `${this.clientId}:${this.clientSecret}`,
    ).toString('base64');

    return `Basic ${encoded}`;
  }

  public getAuthRequestConfig(): AxiosRequestConfig {
    return {
      url: this.tokenUrl,
      method: 'POST',
      data: qs.stringify({
        grant_type: 'client_credentials',
      }),
      headers: {
        Authorization: this.getAuthorizationString(),
      },
    };
  }
}
