import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { NestSchedule, Timeout } from 'nest-schedule';

@Injectable()
export class FormCharacterScheduler extends NestSchedule {
  constructor(
    @InjectQueue('form-character')
    private readonly queue: Queue,
  ) {
    super();
  }

  @Timeout(3000)
  updateSubmissionCharacters() {
    this.queue.add('characterUpdate');
  }
}
