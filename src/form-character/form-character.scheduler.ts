import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { Cron, NestSchedule } from 'nest-schedule';

@Injectable()
export class FormCharacterScheduler extends NestSchedule {
  constructor(
    @InjectQueue('form-character')
    private readonly queue: Queue,
  ) {
    super();
  }

  @Cron('0 * * * *')
  updateSubmissionCharacters() {
    this.queue.add('characterUpdate');
  }
}
