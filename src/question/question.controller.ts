import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UseRoles } from 'nest-access-control';
import { ComposeGuard } from '../auth/guards/compose.guard';
import { FindFormDto } from '../form/dto';
import { CreateQuestionDto, FindQuestionDto, UpdateQuestionDto } from './dto';
import { Question } from './question.entity';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @UseGuards(ComposeGuard)
  @UseRoles({ resource: 'question', action: 'create', possession: 'any' })
  create(@Body() createQuestionDto: CreateQuestionDto): Promise<Question> {
    return this.questionService.create(createQuestionDto);
  }

  @Get()
  findByForm(@Param() { id }: FindFormDto): Promise<Question[]> {
    return this.questionService.findByForm(id);
  }

  @Get(':id')
  findOne(@Param() { id }: FindQuestionDto): Promise<Question> {
    return this.questionService.findOne(id);
  }

  @Put(':id')
  @UseGuards(ComposeGuard)
  @UseRoles({ resource: 'question', action: 'update', possession: 'any' })
  update(@Body() updateQuestionDto: UpdateQuestionDto): Promise<Question> {
    return this.questionService.update(updateQuestionDto);
  }

  @Delete(':id')
  @UseGuards(ComposeGuard)
  @UseRoles({ resource: 'question', action: 'delete', possession: 'any' })
  delete(@Param() { id }: FindQuestionDto): Promise<Question> {
    return this.questionService.delete(id);
  }
}
