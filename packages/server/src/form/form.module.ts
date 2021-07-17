import { Module } from '@nestjs/common';
import { FormQuestionModule } from '../form-question/question.module';
import { FormController } from './form.controller';
import { FormService } from './form.service';

@Module({
  imports: [FormQuestionModule],
  providers: [FormService],
  controllers: [FormController],
  exports: [FormService],
})
export class FormModule {}
