import { HttpService, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';

export interface Token {
  access_token: string;
  expires_in: number;
  expires: number;
  token_type: string;
}

@Injectable()
export class TokenService {
  private readonly logger: Logger = new Logger(TokenService.name);

  private static token: Token = null;

  constructor(private readonly configService: ConfigService, private readonly http: HttpService) {}

  async getToken(): Promise<void> {
    if (TokenService.token !== null && TokenService.token.expires >= new Date().getTime()) return;

    this.logger.log('Retrieving new auth token...');

    try {
      const resp = (await this.http
        .request({
          url: 'https://us.battle.net/oauth/token',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          method: 'POST',
          data: 'grant_type=client_credentials',
          auth: {
            username: this.configService.get('BLIZZARD_CLIENTID'),
            password: this.configService.get('BLIZZARD_SECRET'),
          },
        })
        .toPromise()).data;

      // TODO: Investigate why optional chaining is not working with the linter.
      // if (resp?.access_token && resp?.expires_in && resp?.token_type === 'bearer') {
      if (resp && resp.access_token && resp.expires_in && resp.token_type === 'bearer') {
        TokenService.token = resp;
        TokenService.token.expires = new Date().getTime() + (TokenService.token.expires_in - 3600) * 1000;
        return this.setAxiosBearerToken();
      }

      throw new UnauthorizedException('Token data was unexpectedly missing.');
    } catch (error) {
      this.logger.error(error);
      TokenService.token = null;
    }
  }

  private setAxiosBearerToken(): void {
    this.logger.log('Setting access token: ' + TokenService.token.access_token);
    this.http.axiosRef.defaults.headers.common = {
      Authorization: `Bearer ${TokenService.token.access_token}`,
    };
  }

  public clearToken(): void {
    delete this.http.axiosRef.defaults.headers.common.Authorization;
    TokenService.token = null;
  }
}
