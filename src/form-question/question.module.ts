import { Module } from '@nestjs/common';
import { MikroOrmModule } from 'nestjs-mikro-orm';
import { FormQuestionController } from './question.controller';
import { FormQuestion } from './question.entity';
import { FormQuestionService } from './question.service';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [FormQuestion] })],
  providers: [FormQuestionService],
  controllers: [FormQuestionController],
  exports: [FormQuestionService],
})
export class FormQuestionModule {}
