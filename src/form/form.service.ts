import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { Form } from './form.entity';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(Form)
    private readonly repository: Repository<Form>,
  ) {}

  /**
   * Creates a new form.
   * @param createFormDto CreateFormDto
   */
  async create(createFormDto: CreateFormDto): Promise<Form> {
    return this.repository.save(createFormDto);
  }

  /**
   * Finds all forms.
   */
  async findAll(): Promise<Form[]> {
    return this.repository.find();
  }

  /**
   * Finds a form by its id.
   * @param id Form id
   */
  async findOne(id: number): Promise<Form> {
    return this.repository.findOneOrFail(id);
  }

  /**
   * Updates the attributes of a form.
   * @param id Form id
   * @param updateFormDto UpdateFormDto
   */
  async update(id: number, updateFormDto: UpdateFormDto): Promise<Form> {
    const form = await this.repository.findOneOrFail(id);

    this.repository.merge(form, updateFormDto);

    return this.repository.save(form);
  }

  /**
   * Deletes a form by its id.
   * @param id Form id
   */
  async delete(id: number): Promise<Form> {
    const form = await this.repository.findOneOrFail(id);

    return this.repository.remove(form);
  }
}
