import { MikroORM } from '@mikro-orm/core';
import { Injectable, Logger } from '@nestjs/common';
import { CharacterHistoryService } from './character-history.service';

@Injectable()
export class CharacterHistoryScheduler {
  private readonly logger = new Logger(CharacterHistoryScheduler.name);

  constructor(
    private readonly orm: MikroORM,
    private readonly characterHistoryService: CharacterHistoryService,
  ) {}

  // @UseRequestContext()
  // public async updateGuildCharacterHistory() {
  //   const [characters, count] = await this.orm.em.findAndCount(
  //     GuildCharacter,
  //     {},
  //   );

  //   await this.orm.em.populate(characters, ['history'], {
  //     history: {
  //       reset: this.characterHistoryService.getCurrentWeeklyReset(),
  //     },
  //   });

  //   this.logger.log(`Updated ${count} character histories`);
  // }
}
