import { BullModule } from '@nestjs/bull';
import { HttpModule, Module } from '@nestjs/common';
import { MikroOrmModule } from 'nestjs-mikro-orm';
import { BlizzardModule } from '../blizzard/blizzard.module';
import { FileModule } from '../file/file.module';
import { FormCharacterModule } from '../form-character/form-character.module';
import { FormQuestion } from '../form-question/question.entity';
import { FormQuestionService } from '../form-question/question.service';
import { RaiderIOModule } from '../raiderIO/raiderIO.module';
import { SubmissionController } from './form-submission.controller';
import { FormSubmission } from './form-submission.entity';
import { FormSubmissionQueue } from './form-submission.queue';
import { SubmissionService } from './form-submission.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [FormSubmission, FormQuestion] }),
    BullModule.registerQueue({ name: 'form' }),
    HttpModule,
    BlizzardModule,
    RaiderIOModule,
    FormCharacterModule,
    FileModule,
  ],
  providers: [SubmissionService, FormQuestionService, FormSubmissionQueue],
  controllers: [SubmissionController],
  exports: [SubmissionService],
})
export class FormSubmissionModule {}
