import { Injectable, Logger } from '@nestjs/common';
import { NestSchedule, Cron, Timeout } from 'nest-schedule';
import { InjectQueue } from 'nest-bull';
import { Queue } from 'bull';

@Injectable()
export class CharacterScheduler extends NestSchedule {
  private readonly logger: Logger = new Logger(CharacterScheduler.name);

  constructor(
    @InjectQueue('character')
    private readonly queue: Queue,
  ) {
    super();
  }

  @Cron('*/15 * * * *')
  async updateGuildRoster() {
    this.queue.add('updateGuildRoster', null);
  }

  @Cron('0 * * * *')
  async purgeRoster() {
    this.queue.add('purgeGuildRoster', null);
  }

  @Cron('* * * * *')
  async removeNonGuildMembers() {
    this.queue.add('removeNonGuildMembers');
  }
}