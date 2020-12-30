import { EntityRepository } from '@mikro-orm/knex';
import { UseRequestContext } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from 'nestjs-mikro-orm';
import { RESET_DAY, RESET_HOUR_UTC } from '../app.constants';
import { getLastWeekday } from '../app.utils';
import { CharacterHistory } from './character-history.entity';

@Injectable()
export class CharacterHistoryService {
  private readonly logger = new Logger(CharacterHistoryService.name);

  constructor(
    @InjectRepository(CharacterHistory)
    private readonly characterHistoryRepository: EntityRepository<CharacterHistory>,
  ) {}

  /**
   * Returns the currently active weekly reset by its starting date and time.
   */
  public getCurrentWeeklyReset() {
    const reset = getLastWeekday(RESET_DAY, RESET_HOUR_UTC);

    // Correct for the time after Tuesday starts but before the reset hour.
    if (reset > new Date()) {
      reset.setUTCDate(reset.getUTCDate() - 7);
    }

    return reset;
  }

  @UseRequestContext()
  private async fetchGuildCharacterHistory() {}
}
