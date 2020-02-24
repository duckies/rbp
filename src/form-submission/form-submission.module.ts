import { BullModule } from '@nestjs/bull';
import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlizzardModule } from '../blizzard/blizzard.module';
import { FormQuestion } from '../form-question/question.entity';
import { FormQuestionService } from '../form-question/question.service';
import { FormSubmissionReadModule } from '../form-submission-seen/form-submission-read.module';
import { RaiderIOModule } from '../raiderIO/raiderIO.module';
import { SubmissionController } from './form-submission.controller';
import { FormSubmission } from './form-submission.entity';
import { FormSubmissionQueue } from './form-submission.queue';
import { SubmissionService } from './form-submission.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FormSubmission, FormQuestion]),
    BullModule.registerQueue({ name: 'form' }),
    HttpModule,
    FormSubmissionReadModule,
    BlizzardModule,
    RaiderIOModule,
  ],
  providers: [SubmissionService, FormQuestionService, FormSubmissionQueue],
  controllers: [SubmissionController],
  exports: [SubmissionService],
})
export class FormSubmissionModule {}
