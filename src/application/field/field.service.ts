import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Field, FieldType } from './field.entity';
import { Repository, MoreThan, Between } from 'typeorm';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';

@Injectable()
export class FieldService {
  constructor(
    @InjectRepository(Field)
    private readonly fieldRepository: Repository<Field>,
  ) {}

  create(createFieldDto: CreateFieldDto): Promise<Field> {
    return this.fieldRepository.save(createFieldDto);
  }

  findAll(): Promise<Field[]> {
    return this.fieldRepository.find({
      order: {
        order: 'ASC',
      },
    });
  }

  findOne(id: number): Promise<Field> {
    return this.fieldRepository.findOneOrFail(id);
  }

  async update(id: number, updateFieldDto: UpdateFieldDto): Promise<Field> {
    const field = await this.fieldRepository.findOneOrFail(id);
    const currentPosition = field.order,
      desiredPosition = updateFieldDto.order;
    const options = updateFieldDto.options;

    // Modifying a field type is not possible, but we can modify its options
    // and we need to ensure that the options make sense for the type.
    if (!!options) {
      switch (field.type) {
        case FieldType.TEXTAREA:
        case FieldType.TEXTINPUT:
          if (options.multiple) {
            throw new BadRequestException(`${field.type} does not allow the multiple option.`);
          }
          if (options.choices) {
            throw new BadRequestException(`${field.type} does not allow the choices option.`);
          }
          break;
        case FieldType.CHECKBOX:
        case FieldType.SELECT:
          if (!options.choices || (!!options.choices && !options.choices.length)) {
            throw new BadRequestException(`${field.type} requires choices option.`);
          }
          break;
        default:
          break;
      }
    }

    // A transaction is needed to update all field positions only if the order is changed.
    // Using this method: https://blogs.wayne.edu/web/2017/03/13/updating-a-database-display-order-with-drag-and-drop-in-sql/
    if (desiredPosition && desiredPosition !== currentPosition) {
      const move = updateFieldDto.order > currentPosition ? 'down' : 'up';

      await this.fieldRepository.manager.transaction(async transactionalEntityManager => {
        field.order = 0;
        await field.save();

        if (move === 'down') {
          // Decrement items between the current position and the desired position.
          await this.fieldRepository.decrement(
            { order: Between(currentPosition + 1, desiredPosition) },
            'order',
            1,
          );
        }

        if (move === 'up') {
          // Increment items from desired position and the current position.
          await this.fieldRepository.increment(
            { order: Between(desiredPosition, currentPosition - 1) },
            'order',
            1,
          );
        }
      });
    }

    const result = this.fieldRepository.merge(field, updateFieldDto);

    return this.fieldRepository.save(result);
  }

  async delete(id: number): Promise<Field> {
    const field = await this.fieldRepository.findOneOrFail(id);

    return this.fieldRepository.remove(field);
  }
}
