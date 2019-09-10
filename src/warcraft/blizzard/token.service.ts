import { Injectable, HttpService, Logger } from '@nestjs/common';
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
  private token: Token = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly http: HttpService,
  ) {}

  async getToken(): Promise<void> {
    if (this.token != null && this.token.expires <= new Date().getTime())
      return;

    try {
      const resp = await this.http
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
        .toPromise();

      if (
        resp &&
        resp.data &&
        resp.data.access_token &&
        resp.data.expires_in &&
        resp.data.token_type === 'bearer'
      ) {
        this.token = resp.data;
        this.token.expires =
          new Date().getTime() + (this.token.expires_in - 3600) * 1000;
        return this.setAxiosBearerToken();
      } else {
        this.token = null;
      }
    } catch (error) {
      this.logger.error(error);
      this.token = null;
    }
  }

  private setAxiosBearerToken(): void {
    this.http.axiosRef.defaults.headers.common = {
      Authorization: `Bearer ${this.token.access_token}`,
    };
  }

  public clearToken(): void {
    this.token = null;
  }
}
