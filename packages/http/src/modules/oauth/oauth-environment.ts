import qs from 'qs';

export class HTTPOAuthEnvironment {
  constructor(
    public readonly name: string,
    private readonly clientId: string,
    private readonly clientSecret: string,
    public readonly tokenURL: string,
  ) {}

  public get AuthorizationString() {
    const encoded = Buffer.from(
      `${this.clientId}:${this.clientSecret}`,
    ).toString('base64');

    return `Basic ${encoded}`;
  }

  public get RequestConfig() {
    return {
      url: this.tokenURL,
      method: 'POST',
      data: qs.stringify({
        grant_type: 'client_credentials',
      }),
      headers: {
        Authorization: this.AuthorizationString,
      },
    };
  }
}
