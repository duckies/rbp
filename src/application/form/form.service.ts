import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Form } from './form.entity';
import { Repository, Any } from 'typeorm';
import { CreateFormDto } from './dto/create-form.dto';
import { FieldService } from '../field/field.service';
import { isEqual } from 'lodash';
import { User } from '../../user/user.entity';
import { FormStatus } from './form-status.enum';
import { UpdateFormDto } from './dto/update-form.dto';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(Form)
    private readonly formRepository: Repository<Form>,
  ) {}

  async create(user: User, createFormDto: CreateFormDto): Promise<Form> {
    const openForms = await this.findAllByUserStatus(user, FormStatus.Open);

    if (openForms.length) {
      throw new BadRequestException('Close open application before opening another.');
    }

    const form = new Form();

    form.author = user;

    const result = this.formRepository.merge(form, createFormDto);

    return this.formRepository.save(result);
  }

  async findAllByUserStatus(user: User, status?: FormStatus): Promise<Form[]> {
    let query = this.formRepository
      .createQueryBuilder('form')
      .select(['form.id', 'form.status', 'form.characterData'])
      .where('form.author = :user', { user });
    if (status) query = query.andWhere(`status = :status`, { status });

    return await query.getMany();
  }

  // Incomplete, this will need to have pagination.
  async findByIdAndSimilarStatus(id: number) {
    const form = await this.formRepository.findOneOrFail(id);
    const similar = await this.formRepository.find({
      where: { status: form.status },
      relations: ['user'],
    });

    return { application: form, similar };
  }

  async findAllByStatus(status: FormStatus): Promise<Form[]> {
    return this.formRepository.find({ status });
  }

  async findOpenByUser(user: User): Promise<Form> {
    return this.formRepository.findOneOrFail({
      where: { author: user, status: FormStatus.Open },
    });
  }

  async update(id: number, updateFormDto: UpdateFormDto): Promise<Form> {
    const form = await this.formRepository.findOneOrFail(id);

    const result = await this.formRepository.merge(form, updateFormDto);

    return this.formRepository.save(result);
  }

  async delete(id: number): Promise<Form> {
    const form = await this.formRepository.findOneOrFail(id);

    return this.formRepository.remove(form);
  }
}
