import { HttpService, Injectable } from '@nestjs/common';
import { RaiderIOGuild } from './raiderIO.interface';

export enum GuildRaiderIOFields {
  RAID_PROGRESSION = 'raid_progression',
  RAID_RANKINGS = 'raid_rankings',
}

@Injectable()
export class RaiderIOService {
 constructor(private readonly http: HttpService) {}

  /**
   * Obtains guild data from Raider.IO about the guild.
   * @param fields
   */
  async getGuildRaiderIO(
    fields: GuildRaiderIOFields[] = [
      GuildRaiderIOFields.RAID_PROGRESSION,
      GuildRaiderIOFields.RAID_RANKINGS,
    ],
  ): Promise<RaiderIOGuild> {
    const api = `https://raider.io/api/v1/guilds/profile?region=us&realm=blackrock&name=really bad players${
      fields.length ? '&fields=' + fields : ''
    }`;

    const resp = await this.http.get(api).toPromise();

    return resp.data;
  }
}