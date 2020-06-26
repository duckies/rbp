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

  // @Cron('0 * * * *')
  // updateGuildRoster(): void {
  //   this.queue.add('updateGuildRoster', { attempts: 1 });
  // }

  // @Timeout(5000)
  updateMembers() {
    this.queue.add('update-guild-members', { attempts: 1 });
  }

  // @Timeout(20000)
  // addRemove(): void {
  //   this.queue.add('add-remove-members', { attempts: 1, removeOnFail: true });
  // }

  // @Cron('0 */3 * * *')
  // purgeRoster(): void {
  //   this.queue.add('purgeGuildRoster');
  // }

  // @Cron('0 */3 * * *')
  // removeNonGuildMembers(): void {
  //   this.queue.add('removeNonGuildMembers');
  // }
}
