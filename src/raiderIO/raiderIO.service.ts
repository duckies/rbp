<<<<<<< HEAD
import { HttpService, Injectable } from '@nestjs/common';
import { FindCharacterDto } from '../blizzard/dto/find-character.dto';
import { RaiderIOCharacterFieldsDto } from './dto/char-fields.dto';
=======
import {
  HttpService,
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FindCharacterDto } from '../blizzard/dto/find-character.dto';
import { RaiderIOCharacterFieldsDto, RaiderIOCharacterFields } from './dto/char-fields.dto';
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
import { RaiderIOGuild } from './raiderIO.interface';

export enum GuildRaiderIOFields {
  RAID_PROGRESSION = 'raid_progression',
  RAID_RANKINGS = 'raid_rankings',
}

<<<<<<< HEAD
=======
export type RaiderIOCharacterFieldsType = {
  [RaiderIOCharacterFields.GEAR]: any;
  [RaiderIOCharacterFields.GUILD]: any;
  [RaiderIOCharacterFields.MYTHIC_PLUS_BEST_RUNS]: any;
  [RaiderIOCharacterFields.MYTHIC_PLUS_HIGHEST_LEVEL_RUNS]: any;
  [RaiderIOCharacterFields.MYTHIC_PLUS_RANKS]: any;
  [RaiderIOCharacterFields.MYTHIC_PLUS_RECENT_RUNS]: any;
  [RaiderIOCharacterFields.MYTHIC_PLUS_SCORES_BY_CURRENT_SEASON]: any;
  [RaiderIOCharacterFields.MYTHIC_PLUS_SCORES_BY_PREVIOUS_SEASON]: any;
  [RaiderIOCharacterFields.MYTHIC_PLUS_SCORES_BY_SEASON]: any;
  [RaiderIOCharacterFields.MYTHIC_PLUS_WEEKLY_HIGHEST_LEVEL_RUNS]: any;
  [RaiderIOCharacterFields.PREVIOUS_MYTHIC_PLUS_RANKS]: any;
  [RaiderIOCharacterFields.RAID_ACHIEVEMENT_META]: any;
  [RaiderIOCharacterFields.RAID_ACHIEVEMENT_META]: any;
};

type what = RaiderIOCharacterFields[];

export type RaiderIOCharacterReturnType = {
  name: string;
  race: string;
  class: string;
  active_spec_name: string;
  active_spec_role: string;
  gender: string;
  faction: string;
  region: string;
  realm: string;
  profile_url: string;
};

>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
@Injectable()
export class RaiderIOService {
  private guildFields = [GuildRaiderIOFields.RAID_PROGRESSION, GuildRaiderIOFields.RAID_RANKINGS];

  constructor(private readonly http: HttpService) {}

  /**
   * Obtains guild data from Raider.IO.
   * @param fields
   */
  async getGuildRaiderIO(fields: GuildRaiderIOFields[] = this.guildFields): Promise<RaiderIOGuild> {
<<<<<<< HEAD
    const api = `https://raider.io/api/v1/guilds/profile?region=us&realm=blackrock&name=really bad players${
=======
    const api = `https://raider.io/api/v1/guilds/profile?region=us&realm=area-52&name=really bad players${
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
      fields.length ? `&fields=${fields}` : ''
    }`;

    return (await this.http.get(api).toPromise()).data;
  }

  /**
   * Obtains character data from Raider.IO
   * @param characterLookupDto
   * @param raiderIOCharacterFieldsDto
   */
<<<<<<< HEAD
  async getCharacterRaiderIO(
    { name, realm, region }: FindCharacterDto,
    { fields }: RaiderIOCharacterFieldsDto,
  ): Promise<unknown> {
    const api = `https://raider.io/api/v1/characters/profile?region=${region}&realm=${realm}&name=${name}${
      fields.length ? `&fields=${fields}` : ''
    }`;
    console.log(api)
    return (await this.http.get(api).toPromise()).data;
=======
  async getCharacterRaiderIO<K extends RaiderIOCharacterFields>(
    { name, realm, region }: FindCharacterDto,
    fields: K[],
  ): Promise<any> {
    try {
      const api = `https://raider.io/api/v1/characters/profile?region=${region}&realm=${realm}&name=${name}${
        fields.length ? `&fields=${fields}` : ''
      }`;
      return (await this.http.get(api).toPromise()).data;
    } catch (error) {
      switch (error.response.status) {
        case 404:
          throw new NotFoundException(error.response.data);

        case 400:
          throw new BadRequestException(error.response.data);

        default:
          console.error(error.response.status, error.response.data);
          throw new InternalServerErrorException(error.response.data);
      }
    }
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
  }
}
