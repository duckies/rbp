import { EntityManager, FilterQuery, FindOptions } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { Slide } from './slide.entity';

@Injectable()
export class SlideService {
  constructor(private readonly em: EntityManager) {}

  async create(createSlideDto: CreateSlideDto) {
    const slide = this.em.create(Slide, createSlideDto);

    await this.em.persist(slide).flush();

    return slide;
  }

  findOne(where: FilterQuery<Slide>) {
    return this.em.findOneOrFail(Slide, where);
  }

  findAll(where: FilterQuery<Slide>, options?: FindOptions<Slide, any>) {
    return this.em.findAndCount(Slide, where, options);
  }

  async update(where: FilterQuery<Slide>, updateSlideDto: UpdateSlideDto) {
    const slide = await this.em.findOneOrFail(Slide, where);

    this.em.assign(slide, updateSlideDto);

    await this.em.flush();

    return slide;
  }

  async delete(where: FilterQuery<Slide>) {
    const slide = await this.em.findOneOrFail(Slide, where);

    await this.em.remove(slide).flush();

    return slide;
  }
}
