import { EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
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
   *
   * @param createFormDto properties for the form
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
    return this.formRepository.findAll();
  }

  /**
   * Finds a form by its id.
   *
   * @param id id of the form
   */
  async findOne(id: number) {
    return this.formRepository.findOneOrFail(id);
  }

  /**
   * Updates a form.
   *
   * @param id id of the form
   * @param updateFormDto properties to update
   */
  async update(id: number, updateFormDto: UpdateFormDto) {
    const form = await this.formRepository.findOneOrFail(id);

    form.assign(updateFormDto);

    await this.formRepository.flush();

    return form;
  }

  /**
   * Removes a form. This also cascade-deletes questions and submissions.
   *
   * @param id Form id
   */
  async delete(id: number) {
    const form = await this.formRepository.findOneOrFail(id);

    this.formRepository.remove(form);

    await this.formRepository.flush();

    return form;
  }
}
