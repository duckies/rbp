import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { Slide } from './slide.entity';

@Injectable()
export class SlideService {
  constructor(
    @InjectRepository(Slide)
    private readonly slideRepository: Repository<Slide>,
  ) {}

  create(createSlideDto: CreateSlideDto): Promise<Slide> {
    return this.slideRepository.save(createSlideDto);
  }

  findAll(take = 10, skip = 0): Promise<Slide[]> {
    return this.slideRepository.find({
      order: { id: 'DESC' },
      take,
      skip,
    });
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
