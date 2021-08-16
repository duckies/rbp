import { Options } from 'got';
import { HTTP } from '../../http.js';
import { ClientCredentialResponse } from './interfaces/token-response.interface.js';
import { HTTPOAuthEnvironment } from './oauth-environment.js';
import { Token } from './token.js';

export class HTTPOAuthModule {
  private token: Token | null = null;
  private pendingAuthorization: Promise<void> | null = null;

  constructor(
    private readonly http: HTTP,
    private readonly environment: HTTPOAuthEnvironment,
  ) {
    this.http.onBeforeRequest(this.onBeforeRequest);
  }

  public async getAccessToken() {
    try {
      const { url, data, headers } = this.environment.RequestConfig;
      const response = await this.http.$post<ClientCredentialResponse>(url, {
        data,
        headers,
      });

      this.token = new Token(response);
      this.http.setHeader('Authorization', this.token.AuthorizationString);
    } catch (error) {
      this.token = null;
      this.http.setHeader('Authorization', false);
    }
  }

  /**
   * Intercepts the `request` event and ensures the `Authorization` header is set.
   */
  public async onBeforeRequest(options: Options) {
    if (options.headers['Authorization']) return;

    // Don't initiate a new authorization request if one is already in progress.
    if (!this.pendingAuthorization) {
      this.pendingAuthorization = this.getAccessToken();
    }

    await this.pendingAuthorization;
  }
}
