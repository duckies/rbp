import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { FieldService } from './field.service';
import { UseRoles } from 'nest-access-control';
import { CreateFieldDto } from './dto/create-field.dto';
import { Field } from './field.entity';
import { ComposeGuard } from '../../auth/guards/compose.guard';
import { UpdateFieldDto } from './dto/update-field.dto';

@Controller('field')
export class FieldController {
  constructor(private readonly fieldService: FieldService) {}

  @Post()
  @UseGuards(ComposeGuard)
  @UseRoles({ resource: 'field', action: 'create', possession: 'any' })
  create(@Body() createFieldDto: CreateFieldDto): Promise<Field> {
    return this.fieldService.create(createFieldDto);
  }

  @Get()
  findAll(): Promise<Field[]> {
    return this.fieldService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Field> {
    return this.fieldService.findOne(id);
  }

  @Put(':id')
  @UseGuards(ComposeGuard)
  @UseRoles({ resource: 'field', action: 'update', possession: 'any' })
  update(
    @Param('id') id: number,
    @Body() updateFieldDto: UpdateFieldDto,
  ): Promise<Field> {
    return this.fieldService.update(id, updateFieldDto);
  }

  @Delete(':id')
  @UseGuards(ComposeGuard)
  @UseRoles({ resource: 'field', action: 'delete', possession: 'any' })
  delete(@Param('id') id: number): Promise<Field> {
    return this.fieldService.delete(id);
  }
}
