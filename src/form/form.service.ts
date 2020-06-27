import { Injectable } from '@nestjs/common';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from 'nestjs-mikro-orm';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { Form } from './form.entity';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(Form)
    private readonly formRepository: EntityRepository<Form>,
  ) {}

  /**
   * Creates a new form.
   * @param createFormDto CreateFormDto
   */
  async create(createFormDto: CreateFormDto) {
    const form = this.formRepository.create(createFormDto);

    await this.formRepository.persistAndFlush(form);

    return form;
  }

  /**
   * Finds all forms.
   */
  async findAll() {
    return this.formRepository.find({});
  }

  /**
   * Finds a form by its id.
   * @param id Form id
   */
  async findOne(id: number) {
    return this.formRepository.findOneOrFail(id);
  }

  /**
   * Updates the attributes of a form.
   * @param id Form id
   * @param updateFormDto UpdateFormDto
   */
  async update(id: number, updateFormDto: UpdateFormDto) {
    const form = await this.formRepository.findOneOrFail(id);

    wrap(form).assign(updateFormDto);

    await this.formRepository.flush();

    return form;
  }

  /**
   * Deletes a form by its id.
   * @param id Form id
   */
  async delete(id: number) {
    const form = await this.formRepository.findOneOrFail(id);

    await this.formRepository.remove(form);

    return form;
  }
}
