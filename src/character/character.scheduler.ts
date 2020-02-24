<<<<<<< HEAD
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from 'nest-bull';
import { Cron, NestSchedule } from 'nest-schedule';
=======
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { NestSchedule } from 'nest-schedule';
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028

@Injectable()
export class CharacterScheduler extends NestSchedule {
  constructor(
    @InjectQueue('character')
    private readonly queue: Queue,
  ) {
    super();
  }

<<<<<<< HEAD
  @Cron('*/15 * * * *')
  updateGuildRoster(): void {
    this.queue.add('updateGuildRoster');
  }
=======
  // @Cron('*/15 * * * *')
  // updateGuildRoster(): void {
  //   this.queue.add('updateGuildRoster');
  // }
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028

  // @Cron('0 * * * *')
  // purgeRoster(): void {
  //   this.queue.add('purgeGuildRoster');
  // }

  // @Cron('0 * * * *')
  // removeNonGuildMembers(): void {
  //   this.queue.add('removeNonGuildMembers');
  // }
}
