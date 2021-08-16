import { MikroORM } from '@mikro-orm/core';
import { UseRequestContext } from '@mikro-orm/nestjs';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Cron, Timeout } from '@nestjs/schedule';
import { EVERY_TEN_MINUTES } from '../app.constants';
import { FindGuildDto } from '../blizzard/dto/find-guild.dto';
import { RealmSlug } from '../blizzard/enums/realm.enum';
import { Region } from '../blizzard/enums/region.enum';
import { ProfileService } from '../blizzard/services/profile/profile.service';
import { GuildCharacter } from './character.entity';
import { CharacterService } from './character.service';

@Injectable()
export class CharacterScheduler {
  private readonly logger = new Logger(CharacterScheduler.name);
  private readonly dto: FindGuildDto = {
    name: 'really-bad-players',
    realm: RealmSlug.Area52,
    region: Region.US,
  };

  constructor(
    private readonly orm: MikroORM,
    private readonly profileService: ProfileService,
    private readonly characterService: CharacterService,
  ) {}

  // @Timeout(500)
  @Cron(EVERY_TEN_MINUTES)
  @UseRequestContext()
  private async updateGuildMembers() {
    const results = {
      total: 0,
      processed: 0,
      added: 0,
      success: 0,
      deleted: 0,
      ignored: 0,
      failed: 0,
    };

    const [characters, roster] = await Promise.allSettled([
      this.orm.em.find(GuildCharacter, {}),
      this.profileService.getGuildRoster(this.dto),
    ]);

    if (characters.status === 'rejected') {
      throw new Error('Unable to retrieve local characters');
    }

    if (roster.status === 'rejected') {
      throw new Error('Unable to retrieve guild roster');
    }

    await Promise.all(
      roster.value.data.members.map(async (member) => {
        let isNew = false;
        let character = characters.value.find(
          (c) =>
            c.name === member.character.name &&
            c.realm === member.character.realm.slug &&
            c.region === this.dto.region,
        );

        if (!character) {
          isNew = true;
          character = new GuildCharacter(
            member.character.name,
            member.character.realm.slug,
            this.dto.region,
          );
        }

        try {
          const status = await this.profileService.getCharacterProfileStatus(
            character.getFindCharacterDTO(),
            character.last_modified,
          );

          // New character does not have a valid status.
          if (!status.data.is_valid && isNew) return;

          // Existing character does not have a valid status.
          if (
            !status.data.is_valid ||
            (!isNew && status.data.id !== character.id)
          ) {
            results.deleted++;
            return this.orm.em.remove(character);
          }

          character.last_modified = status.headers['last-modified'];
          character.guild_rank = member.rank;

          await this.characterService.populateGuildCharacter(character);

          if (isNew) {
            this.orm.em.persist(character);
            results.added++;
          }

          results.success++;
        } catch (error) {
          if (error instanceof HttpException) {
            if (error.getStatus() === 304) {
              return results.ignored++;
            }

            if (error.getStatus() === 404) {
              return this.orm.em.remove(character);
            }
          }

          this.logger.error(error.message, error.stack);
        }
      }),
    );

    await this.orm.em.flush();

    console.log(results);
  }

  private async removeGuildMembers() {
    const roster = await this.profileService.getGuildRoster(this.dto);

    const ids = roster.data.members.map((m) => m.character.id);

    const notInGuild = await this.orm.em.find(GuildCharacter, {
      id: { $nin: ids },
    });

    const names = notInGuild.map((m) => m.name);

    await this.orm.em.remove(notInGuild).flush();

    this.logger.log(
      `Removed ${names.length} guild member${
        names.length === 0 ? 's' : names.length === 1 ? ':' : 's:'
      } ${names.join(',')}`,
    );
  }
}
