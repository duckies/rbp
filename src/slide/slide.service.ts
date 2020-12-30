import { EntityRepository, QueryOrder, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { Slide } from './slide.entity';

@Injectable()
export class SlideService {
  constructor(
    @InjectRepository(Slide)
    private readonly slideRepository: EntityRepository<Slide>,
  ) {}

  async create(createSlideDto: CreateSlideDto) {
    const slide = this.slideRepository.create(createSlideDto);

    await this.slideRepository.persistAndFlush(slide);

    return slide;
  }

  findAll(limit = 10, offset = 0) {
    return this.slideRepository.find(
      {},
      {
        orderBy: { id: QueryOrder.DESC },
        limit,
        offset,
      },
    );
  }

  findOne(id: number) {
    return this.slideRepository.findOneOrFail(id);
  }

  async update(id: number, updateSlideDto: UpdateSlideDto) {
    const slide = await this.slideRepository.findOneOrFail(id);

    wrap(slide).assign(updateSlideDto);

    await this.slideRepository.flush();

    return slide;
  }

  async delete(id: number) {
    const slide = await this.slideRepository.findOneOrFail(id);

    await this.slideRepository.remove(slide);

    return slide;
  }
}
