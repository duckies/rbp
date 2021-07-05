import {
  HttpService,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  TWITCH_AUTH_URL,
  TWITCH_CLIENT_ID,
  TWITCH_GAME_ENDPOINT,
  TWITCH_STREAM_ENDPOINT,
  TWITCH_USER_ENDPOINT,
} from '../app.constants';
import { TwitchGame } from './interfaces/game.interface';
import { TwitchStream } from './interfaces/stream.interface';
import { TwitchToken } from './interfaces/token.interface';
import { TwitchEndpoint } from './interfaces/twitch.interface';
import { TwitchUser } from './interfaces/user.interface';

@Injectable()
export class TwitchService {
  private readonly logger = new Logger(TwitchService.name);
  private token: TwitchToken;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Retrieves the stream information from a user, if available.
   *
   * @param userId ID of the user
   */
  public async getStream(userId: string) {
    const resp = await this.getTwitchAPI<TwitchEndpoint<TwitchStream>>(
      TWITCH_STREAM_ENDPOINT,
      { user_id: userId },
    );

    if (!resp.data.data[0]) {
      throw new NotFoundException('TwitchStreamNotFound');
    }

    return resp.data.data[0];
  }

  /**
   * Retrieves game data from the Twitch Helix API.
   *
   * @param gameId ID of the game
   */
  public async getGame(gameId: string) {
    const resp = await this.getTwitchAPI<TwitchEndpoint<TwitchGame>>(
      TWITCH_GAME_ENDPOINT,
      { id: gameId },
    );

    if (!resp.data.data[0]) {
      throw new NotFoundException('TwitchGameNotFound');
    }

    return resp.data.data[0];
  }

  /**
   * Retrives the user id from a channel name.
   *
   * The Twitch documentation references channel names as 'login'.
   */
  public async getUser(channel: string) {
    const resp = await this.getTwitchAPI<TwitchEndpoint<TwitchUser>>(
      TWITCH_USER_ENDPOINT,
      {
        login: channel,
      },
    );

    if (!resp.data.data[0]) {
      throw new NotFoundException('TwitchUserNotFound');
    }

    return resp.data.data[0];
  }

  /**
   * Forms a get request to the Twitch Helix API by constructing the necessary
   * headers.
   *
   * @param url url of the Twitch Helix endpoint
   * @param params object of parameters for the request
   */
  private async getTwitchAPI<T>(url: string, params: Record<string, any>) {
    try {
      return this.http
        .get<T>(url, {
          headers: {
            'Client-ID': this.config.get(TWITCH_CLIENT_ID),
            Authorization: `Bearer ${await this.getToken()}`,
          },
          params,
        })
        .toPromise();
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          throw new UnauthorizedException();
        }
      }

      throw new InternalServerErrorException();
    }
  }

  /**
   * Retrieves the token for authenticating Twitch requests.
   */
  private async getToken() {
    if (!this.isTokenExpired()) return this.token.access_token;

    this.logger.log('Generating credentials');

    try {
      const resp = (
        await this.http
          .post(TWITCH_AUTH_URL, null, {
            params: {
              client_id: this.config.get('TWITCH_CLIENT_ID'),
              client_secret: this.config.get('TWITCH_SECRET_KEY'),
              grant_type: 'client_credentials',
            },
          })
          .toPromise()
      ).data;

      if (
        resp &&
        resp.access_token &&
        resp.expires_in &&
        resp.token_type === 'bearer'
      ) {
        this.token = resp;
        this.token.expires_at =
          new Date().getTime() + (this.token.expires_in - 3600) * 1000;

        return this.token.access_token;
      }
    } catch (error) {
      console.error(error);
      this.logger.error(error);
    }
  }

  /**
   * Determines if the Twitch access token is missing or expired.
   */
  private isTokenExpired() {
    // No token currently available.
    if (!this.token) return true;

    // The calculated expiration has elapsed.
    if (this.token.expires_at < new Date().getTime()) return true;

    return false;
  }
}
