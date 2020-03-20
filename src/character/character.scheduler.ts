import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { NestSchedule, Timeout } from 'nest-schedule';

@Injectable()
export class CharacterScheduler extends NestSchedule {
  constructor(
    @InjectQueue('character')
    private readonly queue: Queue,
  ) {
    super();
  }

  // @Cron('*/15 * * * *')
  @Timeout(3000)
  updateGuildRoster(): void {
    this.queue.add('updateGuildRoster');
  }

  // @Cron('0 * * * *')
  // purgeRoster(): void {
  //   this.queue.add('purgeGuildRoster');
  // }

  // @Cron('0 * * * *')
  // removeNonGuildMembers(): void {
  //   this.queue.add('removeNonGuildMembers');
  // }
}
