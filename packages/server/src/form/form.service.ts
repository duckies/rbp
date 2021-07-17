import { FilterQuery, FindOptions } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { Form } from './form.entity';

@Injectable()
export class FormService {
  constructor(private readonly em: EntityManager) {}

  /**
   * Creates a new form.
   *
   * @param createFormDto properties for the form
   */
  async create(createFormDto: CreateFormDto) {
    const form = this.em.create(Form, createFormDto);

    await this.em.persist(form).flush();

    return form;
  }

  /**
   * Finds all forms.
   */
  async findAll(where: FilterQuery<Form>, options?: FindOptions<Form>) {
    return this.em.findAndCount(Form, where, options);
  }

  /**
   * Find a form by its id.
   */
  async findOneOrFail(id: number) {
    return this.em.findOneOrFail(Form, id);
  }

  /**
   * Updates a form.
   *
   * @param id id of the form
   * @param updateFormDto properties to update
   */
  async update(id: number, updateFormDto: UpdateFormDto) {
    const form = await this.em.findOneOrFail(Form, id);

    form.assign(updateFormDto);

    await this.em.flush();

    return form;
  }

  /**
   * Removes a form. This also cascade-deletes questions and submissions.
   *
   * @param id Form id
   */
  async delete(id: number) {
    const form = await this.em.findOneOrFail(Form, id);

    await this.em.remove(form).flush();

    return form;
  }
}
