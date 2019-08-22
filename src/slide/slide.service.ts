import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Slide } from './slide.entity';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';

@Injectable()
export class SlideService {
  constructor(
    @InjectRepository(Slide)
    private readonly slideRepository: Repository<Slide>,
  ) {}

  create(createSlideDto: CreateSlideDto) {
    return this.slideRepository.save(createSlideDto);
  }

  async findAll(
    take: number = 10,
    skip: number = 0,
  ): Promise<{ result: Slide[]; total: number }> {
    const [result, total] = await this.slideRepository.findAndCount({
      order: { id: 'DESC' },
      take,
      skip,
    });

    return { result, total };
  }

  findOne(id: number): Promise<Slide> {
    return this.slideRepository.findOneOrFail(id);
  }

  async update(id: number, updateSlideDto: UpdateSlideDto): Promise<Slide> {
    const slide = await this.slideRepository.findOneOrFail(id);

    const result = await this.slideRepository.merge(slide, updateSlideDto);

    return this.slideRepository.save(result);
  }

  async delete(id: number): Promise<Slide> {
    const slide = await this.slideRepository.findOneOrFail(id);

    return this.slideRepository.remove(slide);
  }
}
