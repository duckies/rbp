import {
  Injectable,
  HttpService,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from './token.service';
import {
  CharacterLookupDto,
  CharacterFieldsDto,
} from './dto/get-character.dto';
import { GuildLookupDto } from './dto/guild-lookup.dto';
import { GuildFieldsDto } from './dto/guild-fields.dto';
import { CharacterNotFoundException } from './exceptions/character-not-found.exception';
import GuildResponse from '../../../interfaces/guild';

@Injectable()
export class BlizzardService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly http: HttpService,
  ) {}

  async getCharacter(
    characterLookupDto: CharacterLookupDto,
    characterFieldsDto: CharacterFieldsDto,
  ): Promise<any> {
    const { name, realm, region } = characterLookupDto;
    const { fields } = characterFieldsDto;

    // This would eventually be replaced by an automatically updating process.
    await this.tokenService.getToken();

    const api = `https://${region}.api.blizzard.com/wow/character/${realm}/${name}${
      fields != null ? '?fields=' + fields : ''
    }`;

    try {
      const resp = await this.http.get(api).toPromise();

      return resp.data;
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          // Unauthorized, our token is invalid.
          case 401:
            this.tokenService.clearToken();
            throw new UnauthorizedException();

          // Character not found; possibly bugged.
          case 404:
            throw new CharacterNotFoundException(
              characterLookupDto.name,
              characterLookupDto.realm,
            );

          default:
            break;
        }
      }

      // Likely a networking error.
      throw error;
    }
  }

  async getGuild(
    guildLookupDto: GuildLookupDto,
    guildFieldsDto: GuildFieldsDto,
  ): Promise<GuildResponse> {
    // This would eventually be replaced by an automatically updating process.
    await this.tokenService.getToken();

    const api = `https://${guildLookupDto.region}.api.blizzard.com/wow/guild/${
      guildLookupDto.realm
    }/${guildLookupDto.name}${
      guildFieldsDto.fields != null ? '?fields=' + guildFieldsDto.fields : ''
    }`;

    try {
      const resp = await this.http.get(api).toPromise();

      return resp.data;
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          // Unauthorized, our token is invalid.
          case 401:
            this.tokenService.clearToken();
            break;

          // Character not found; possibly bugged.
          case 404:
            throw new NotFoundException(
              `${guildLookupDto.name} on ${
                guildLookupDto.realm
              } was not found.`,
            );

          default:
            break;
        }
      }

      // Likely a networking error.
      throw error;
    }
  }
}
