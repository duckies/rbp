import { Injectable } from '@nestjs/common';
import { FindGuildDto } from '../blizzard/dto/find-guild.dto';
import { HttpService } from '../http/http.service';
import {
  EncounterQuery,
  ReportQuery,
  ReportsQuery,
  ZoneQuery,
} from './interfaces/reports.interface';

@Injectable()
export class WarcraftLogsService {
  constructor(private readonly http: HttpService) {
    http.setLimits({
      autoStart: true,
      interval: 3600000,
      intervalCap: 3600,
    });
  }

  public async getReport(code: string) {
    return (
      await this.http.$post<ReportQuery>('/', {
        query: `{
        reportData {
          report(code: "${code}") {
            code,
            title,
            startTime,
            endTime,
            fights(killType: Encounters) {
              id,
              encounterID,
              kill,
              name,
              difficulty,
              bossPercentage,
              keystoneBonus,
              keystoneLevel,
              keystoneTime
            },
            zone {
              id,
              difficulties {
                id,
                name,
              },
              name
            },
            owner {
              name
            }
          }
        }
      }`,
      })
    ).data.reportData.report;
  }

  public async getReports({ name, realm, region }: FindGuildDto, limit = 5) {
    const resp = await this.http.$post<ReportsQuery>('/', {
      query: `{
        reportData {
          reports (guildName: "${name}", guildServerSlug: "${realm}", guildServerRegion: "${region}", limit: ${limit}) {
            data {
              code,
              title,
              startTime,
              endTime,
              fights(killType: Encounters) {
                id,
                encounterID,
                kill,
                name,
                difficulty,
                bossPercentage,
                keystoneBonus,
                keystoneLevel,
                keystoneTime
              },
              zone {
                id,
                difficulties {
                  id,
                  name,
                },
                name
              },
              owner {
                name
              }
            }
          }
        }
      }`,
    });

    return resp?.data?.reportData?.reports?.data;
  }

  public async getZone(id: number) {
    const resp = await this.http.$post<ZoneQuery>('/', {
      query: `{
        worldData {
          zone(id: ${id}) {
            id,
            name,
            difficulties {
              id,
              name
            },
            encounters {
              id
            }
          }
        }
      }`,
    });

    console.log(resp);

    return resp?.data?.worldData?.zone;
  }

  public async getZoneByEncounter(id: number) {
    const resp = await this.http.$post<EncounterQuery>('/', {
      query: `{
        worldData {
          encounter(id: ${id}) {
            zone {
              id,
              name,
              difficulties {
                id,
                name
              },
              encounters {
                id
              }
            }
          }
        }
      }`,
    });

    console.log(resp);

    return resp?.data?.worldData?.encounter?.zone;
  }
}
