import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { Cron, NestSchedule } from 'nest-schedule';

@Injectable()
export class CharacterScheduler extends NestSchedule {
  constructor(
    @InjectQueue('character')
    private readonly queue: Queue,
  ) {
    super();
  }

  @Cron('0 * * * *')
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
