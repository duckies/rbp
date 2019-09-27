import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/user.entity';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { FormStatus } from './form-status.enum';
import { Form } from './form.entity';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(Form)
    private readonly formRepository: Repository<Form>,
  ) {}

  async create(user: User, createFormDto: CreateFormDto): Promise<Form> {
    const openForms = await this.findAllByUserStatus(user, FormStatus.Open);

    // Users are not permitted multiple open applications.
    if (openForms.length) {
      throw new BadRequestException('User already had an open application.');
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
    if (status) { query = query.andWhere(`status = :status`, { status }); }

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
