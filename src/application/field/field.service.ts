import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Field } from './field.entity';
import { Repository } from 'typeorm';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';

@Injectable()
export class FieldService {
  constructor(
    @InjectRepository(Field)
    private readonly fieldRepository: Repository<Field>
  ) {}

  create(createFieldDto: CreateFieldDto): Promise<Field> {
    return this.fieldRepository.save(createFieldDto);
  }

  findAll(): Promise<Field[]> {
    return this.fieldRepository.find();
  }

  findOne(id: number): Promise<Field> {
    return this.fieldRepository.findOneOrFail(id);
  }

  async update(id: number, updateFieldDto: UpdateFieldDto): Promise<Field> {
    const field = await this.fieldRepository.findOneOrFail(id);

    const result = this.fieldRepository.merge(field, updateFieldDto);

    return this.fieldRepository.save(result);
  }

  async delete(id: number): Promise<Field> {
    const field = await this.fieldRepository.findOneOrFail(id);

    return this.fieldRepository.remove(field);
  }
}