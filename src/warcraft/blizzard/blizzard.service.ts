import { HttpService, Injectable, NotFoundException, UnauthorizedException, BadGatewayException } from '@nestjs/common';
import { KnownCharacter } from '../../user/interfaces/known-character.interface';
import { User } from '../../user/user.entity';
import GuildResponse from '../interfaces/guild.interface';
import { CharacterFieldsDto, CharacterLookupDto } from '../dto/get-character.dto';
import { GuildFieldsDto } from '../dto/guild-fields.dto';
import { GuildLookupDto } from '../dto/guild-lookup.dto';
import { CharacterNotFoundException } from './exceptions/character-not-found.exception';
import { TokenService } from './token.service';
import { AxiosError } from 'axios';
import { UnauthorizedTokenException } from './exceptions/unauthorized-token.exception';

@Injectable()
export class BlizzardService {
  constructor(private readonly tokenService: TokenService, private readonly http: HttpService) {}

  async checkToken(token: string) {
    const req = await this.http
      .post('https://us.battle.net/oauth/check_token', null, { params: { token } })
      .toPromise();

    return req.data;
  }

  async syncUserCharacters(user: User) {
    try {
      const resp = await this.http
        .get('https://us.api.blizzard.com/wow/user/characters', {
          headers: { Authorization: `Bearer ${user.blizzardtoken}` },
        })
        .toPromise();

      const characters: KnownCharacter[] = [];
      for (const character of resp.data.characters) {
        if (character.level < 100) continue;

        characters.push({
          name: character.name,
          realm: character.realm,
          region: 'us',
          class: character.class,
          race: character.race,
          gender: character.gender,
          level: character.level,
          thumbnail: character.thumbnail,
          lastModified: character.lastModified,
        });
      }

      characters.sort((a, b) => b.level - a.level);

      if (!characters.length) throw new BadGatewayException();

      user.knownCharacters = characters;
      user.knownCharactersLastUpdated = new Date();

      await user.save();

      return {
        knownCharacters: characters,
        knownCharactersLastUpdated: user.knownCharactersLastUpdated,
      };
    } catch (error) {
      if (error.response && error.response.status === 401) {
        user.blizzardtoken = null;
        user.blizzardTokenExpiration = null;

        await user.save();

        throw new UnauthorizedTokenException();
      }

      throw error;
    }
  }

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
            throw new CharacterNotFoundException(characterLookupDto.name, characterLookupDto.realm);

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
              `${guildLookupDto.name} on ${guildLookupDto.realm} was not found.`,
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
