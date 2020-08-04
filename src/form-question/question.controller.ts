import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { FindFormDto } from '../form/dto/find-form.dto';
import { CreateQuestionDto, FindQuestionDto, UpdateQuestionDto } from './dto';
import { FormQuestionService } from './question.service';

@Controller('question')
export class FormQuestionController {
  constructor(private readonly formQuestionService: FormQuestionService) {}

  @Auth('question', 'create:any')
  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.formQuestionService.create(createQuestionDto);
  }

  @Get('/form/:id')
  findByForm(@Param() { id }: FindFormDto) {
    return this.formQuestionService.findByForm(id);
  }

  @Get(':id')
  findOne(@Param() { id }: FindQuestionDto) {
    return this.formQuestionService.findOne(id);
  }

  @Auth('question', 'update:any')
  @Patch(':id')
  update(
    @Param() { id }: FindQuestionDto,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.formQuestionService.update(id, updateQuestionDto);
  }

  @Auth('question', 'delete:any')
  @Delete(':id')
  delete(@Param() { id }: FindQuestionDto) {
    return this.formQuestionService.delete(id);
  }
}
