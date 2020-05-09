import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { FindFormDto, UpdateFormDto } from './dto';
import { CreateFormDto } from './dto/create-form.dto';
import { Form } from './form.entity';
import { FormService } from './form.service';

@Controller('form')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Post()
  @Auth({ resource: 'form', action: 'create', possession: 'any' })
  create(@Body() createFormDto: CreateFormDto): Promise<Form> {
    return this.formService.create(createFormDto);
  }

  @Get()
  findAll(): Promise<Form[]> {
    return this.formService.findAll();
  }

  @Get(':id')
  findOne(@Param() { id }: FindFormDto): Promise<Form> {
    return this.formService.findOne(id);
  }

  @Put(':id')
  @Auth({ resource: 'form', action: 'update', possession: 'any' })
  update(@Param() { id }: FindFormDto, @Body() updateFormDto: UpdateFormDto): Promise<Form> {
    return this.formService.update(id, updateFormDto);
  }

  @Delete(':id')
  @Auth({ resource: 'form', action: 'delete', possession: 'any' })
  delete(@Param() { id }: FindFormDto): Promise<Form> {
    return this.formService.delete(id);
  }
}
