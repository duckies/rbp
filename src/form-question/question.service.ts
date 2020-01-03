import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvalidQuestionException } from './exceptions/bad-question.exception';
import { CreateQuestionDto, UpdateQuestionDto } from './dto';
import { choicesFields, FieldType, multipleFields, FormQuestion } from './question.entity';

@Injectable()
export class FormQuestionService {
  constructor(
    @InjectRepository(FormQuestion)
    private readonly repository: Repository<FormQuestion>,
  ) {}

  /**
   * Creates a new question for a form.
   * @param createQuestionDto CreateQuestionDto
   */
  create(createQuestionDto: CreateQuestionDto): Promise<FormQuestion> {
    const question = this.repository.create(createQuestionDto);

    this.validateQuestion(question);

    return this.repository.save(createQuestionDto);
  }

  /**
   * Finds all questions for a form by its id.
   * @param id Form id
   */
  findByForm(id: number): Promise<FormQuestion[]> {
    return this.repository.find({
      where: { formId: id },
      order: { order: 'ASC' },
    });
  }

  /**
   * Finds all of the questions in a form of the specified type.
   * Used primarily for retrieving file upload fields for multer.
   * @param id Form id
   * @param type Question FieldType
   */
  findByFormAndType(id: number, type: FieldType): Promise<FormQuestion[]> {
    return this.repository.find({ formId: id, type });
  }

  /**
   * Finds a question by id.
   * @param id Question UUID
   */
  findOne(id: string): Promise<FormQuestion> {
    return this.repository.findOneOrFail(id);
  }

  /**
   * Updates a question from a valid DTO.
   * @param updateQuestionDto UpdateQuestionDto
   */
  async update(updateQuestionDto: UpdateQuestionDto): Promise<FormQuestion> {
    const question = await this.repository.findOneOrFail(updateQuestionDto.id);

    this.repository.merge(question, updateQuestionDto);
    this.validateQuestion(question);

    return this.repository.save(question);
  }

  /**
   * Deletes a question by id.
   * @param id Question UUID
   */
  async delete(id: string): Promise<FormQuestion> {
    const question = await this.repository.findOneOrFail(id);

    return this.repository.remove(question);
  }

  /**
   * Determines if a question's attributes are in a valid state.
   * @param question Question
   */
  private validateQuestion(question: FormQuestion): void {
    const canHaveMultiple = multipleFields.includes(question.type);
    const canHaveChoices = choicesFields.includes(question.type);

    // Fields that aren't checkbox, select, or radio cannot have choices.
    if (question.choices && !canHaveChoices) {
      throw new InvalidQuestionException(question, 'Cannot have choices.');
    }

    // All of the choice fields (checkbox, select, and radio) require choices.
    if (!question.choices && canHaveChoices) {
      throw new InvalidQuestionException(question, 'Must have choices.');
    }

    if (question.multiple && !canHaveMultiple) {
      throw new InvalidQuestionException(question, 'Cannot have multiple values.');
    }

    // Fields cannot allow multiple choices with only one choice.
    if (question.multiple && question.choices && question.choices.length <= 1) {
      throw new InvalidQuestionException(question, 'Cannot have multiple values with only one choice.');
    }

    // Only the upload field can have file types.
    if (question.fileTypes && question.type !== FieldType.UPLOAD) {
      throw new InvalidQuestionException(question, 'Cannot have file types.');
    }

    // The upload field must have file types.
    if (!question.fileTypes && question.type === FieldType.UPLOAD) {
      throw new InvalidQuestionException(question, 'Must set file types.');
    }
  }
}
