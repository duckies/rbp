import { HttpService, Injectable } from '@nestjs/common';
import { CharacterLookupDto } from '../dto/get-character.dto';
import { RaiderIOCharacterFieldsDto } from './dto/char-fields.dto';
import { RaiderIOGuild } from './raiderIO.interface';

export enum GuildRaiderIOFields {
  RAID_PROGRESSION = 'raid_progression',
  RAID_RANKINGS = 'raid_rankings',
}

@Injectable()
export class RaiderIOService {
  private guildFields = [GuildRaiderIOFields.RAID_PROGRESSION, GuildRaiderIOFields.RAID_RANKINGS];

  constructor(private readonly http: HttpService) {}

  /**
   * Obtains guild data from Raider.IO.
   * @param fields
   */
  async getGuildRaiderIO(fields: GuildRaiderIOFields[] = this.guildFields): Promise<RaiderIOGuild> {
    const api = `https://raider.io/api/v1/guilds/profile?region=us&realm=blackrock&name=really bad players${
      fields.length ? `&fields=${fields}` : ''
    }`;

    return (await this.http.get(api).toPromise()).data;
  }

  /**
   * Obtains character data from Raider.IO
   * @param characterLookupDto
   * @param raiderIOCharacterFieldsDto
   */
  async getCharacterRaiderIO(
    characterLookupDto: CharacterLookupDto,
    raiderIOCharacterFieldsDto: RaiderIOCharacterFieldsDto,
  ): Promise<unknown> {
    const { region, realm, name } = characterLookupDto;
    const api = `https://raider.io/api/v1/characters/profile?region=${region}&realm=${realm}&name=${name}${
      raiderIOCharacterFieldsDto.fields.length ? `&fields=${raiderIOCharacterFieldsDto.fields}` : ''
    }`;

    return (await this.http.get(api).toPromise()).data;
  }
}
