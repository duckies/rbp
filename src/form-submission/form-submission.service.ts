import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { Repository } from 'typeorm';
import { FileService } from '../file/file.service';
import { FormCharacterService } from '../form-character/form-character.service';
import { User } from '../user/user.entity';
import { CreateFormSubmissionDto, UpdateFormSubmissionDto } from './dto';
import { FormSubmissionStatus } from './enums/form-submission-status.enum';
import { FormSubmission } from './form-submission.entity';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(FormSubmission)
    private readonly formSubRepository: Repository<FormSubmission>,
    private readonly formCharacterService: FormCharacterService,
    private readonly fileService: FileService,
    @InjectQueue('form') private readonly queue: Queue,
  ) {}

  /**
   * Creates a new form submission for a user with associated
   * answers and characters.
   * @param author Form submission author.
   * @param createSubmissionDto CreateSubmissionDto
   */
  async create(author: User, { formId, answers, files, characters }: CreateFormSubmissionDto) {
    const formSubmission = new FormSubmission();

    const openForm = await this.formSubRepository.find({
      where: { status: FormSubmissionStatus.Open, authorId: author.id },
      select: ['author'],
    });

    if (openForm.length) {
      throw new BadRequestException(
        'You already have an open form. Please wait for your other application to be processed or cancel it.',
      );
    }

    if (files && files.length) {
      const fileUploads = await this.fileService.find(files);

      for (const upload of fileUploads) {
        if (upload.author && upload.author.id !== author.id) {
          throw new UnauthorizedException('Cannot reference unauthored file.');
        }
      }

      formSubmission.files = fileUploads;
    }

    const formCharacters = await Promise.all(
      characters.map(character =>
        this.formCharacterService.create({
          name: character.name,
          realm: character.realm,
          region: character.region,
        }),
      ),
    );

    formSubmission.formId = formId;
    formSubmission.characters = formCharacters;
    formSubmission.author = author;
    formSubmission.answers = answers;

    formCharacters[0].isMain = true;

    const submission = await this.formSubRepository.save(formSubmission);

    submission.justSubmitted = true;

    await this.queue.add('newApplication', submission);

    return submission;
  }

  /**
   * Finds an individual form submission.
   * @param id Form submission id.
   */
  async findOne(id: number) {
    return this.formSubRepository
      .createQueryBuilder('submission')
      .select()
      .leftJoinAndSelect('submission.author', 'author')
      .leftJoinAndSelect('submission.characters', 'characters')
      .leftJoinAndSelect('submission.files', 'files')
      .leftJoinAndSelect('submission.form', 'form')
      .leftJoinAndSelect('form.questions', 'questions')
      .where('submission.id = :id', { id })
      .orderBy('questions.order')
      .getOne();
  }

  /**
   * Retrieves the first available form submission for a given status.
   * @param status FormSubmissionStatus
   */
  findFirstByStatus(status: FormSubmissionStatus) {
    // This intentionally does not fail so it does not pass the 404 error.
    return this.formSubRepository.findOneOrFail(
      { status },
      {
        relations: ['form', 'author', 'characters'],
        order: {
          id: 'DESC',
        },
      },
    );
  }

  /**
   * Retrieves all forms created by an author regardless of status.
   * @param user Form submission author.
   */
  findByUser(user: User) {
    return this.formSubRepository
      .createQueryBuilder('submission')
      .select(['submission.id', 'submission.status'])
      .leftJoin('submission.author', 'author')
      .where('author.id = :id', { id: user.id })
      .getMany();
  }

  /**
   * Finds the first open form submission by a user, if available.
   * Used to determine if a user has already submitted an application.
   * @param user Form submission author.
   */
  findOpenByUser(user: User): Promise<Pick<FormSubmission, 'id' | 'status'>> {
    return this.formSubRepository
      .createQueryBuilder('submission')
      .select(['submission.id', 'submission.status'])
      .leftJoin('submission.author', 'author')
      .where('author.id = :id', { id: user.id })
      .getOne();
  }

  /**
   * Retrieving a paginated array of form submissions.
   * Search narrowable to status category by an optionally provided status or id.
   *
   * @param take Number of submissions to retrieve.
   * @param skip Number of submissions to skip.
   */
  findAll(take: number, skip: number, status?: FormSubmissionStatus, id?: number, user?: User) {
    let query = this.formSubRepository
      .createQueryBuilder('submission')
      .select([
        'submission.id',
        'submission.status',
        'submission.createdAt',
        'submission.formId',
        'author.id',
        'author.nickname',
        'author.discord_id',
        'author.discord_username',
        'author.discord_discriminator',
        'author.discord_avatar',
        'character.name',
        'character.realm',
        'character.avatar_url',
        'character.bust_url',
        'character.render_url',
        'character.race_id',
        'character.race_name',
        'character.class_id',
        'character.class_name',
        'character.gender',
      ]);

    // Currently cannot add computed selectors to TypeORM. Depression!
    // .addSelect('(seen.id) IS NOT NULL', 'submission.seen')
    if (user) {
      query = query.leftJoinAndSelect('submission.readFormSubmissions', 'read', 'read.userId = :uId', {
        uId: user.id,
      });
    }

    query
      .leftJoin('submission.characters', 'character', 'character.isMain = true')
      .leftJoin('submission.author', 'author');

    // Status category retrieval.
    if (status) {
      query = query.where('submission.status = :status', { status });
    }

    // Subquery status category from id.
    else if (id) {
      query = query.where(qb => {
        const subQuery = qb
          .subQuery()
          .select('submission.status')
          .from('form_submission', 'submission')
          .where('submission.id = :id', { id })
          .getQuery();

        return 'submission.status = ' + subQuery;
      });
    }

    return query
      .orderBy('submission.id', 'DESC')
      .take(take)
      .skip(skip)
      .getManyAndCount();
  }

  /**
   * Updates a form with complete privileges over the status and answers.
   * @param id Form submission id.
   * @param updateFormSubmissionDto UpdateFormSubmissionDto
   */
  async update(id: number, updateFormSubmissionDto: UpdateFormSubmissionDto) {
    const formSubmission = await this.formSubRepository.findOneOrFail(id);

    this.formSubRepository.merge(formSubmission, updateFormSubmissionDto);

    return formSubmission.save();
  }

  /**
   * Updates a form with checks to ensure the user editing it is the author
   * and only allows users to cancel their own applications.
   * @param id Form submission id.
   * @param user Form submission author.
   * @param updateFormSubmissionDto UpdateFormSubmissionDto
   */
  async updateOwn(id: number, user: User, updateFormSubmissionDto: UpdateFormSubmissionDto) {
    if (updateFormSubmissionDto.status && updateFormSubmissionDto.status !== FormSubmissionStatus.Cancelled) {
      throw new ForbiddenException('Can only cancel owned applications.');
    }

    const formSubmission = await this.formSubRepository.findOneOrFail(id, {
      select: ['id', 'status'],
      relations: ['author'],
    });

    if (formSubmission.author.id !== user.id) {
      throw new ForbiddenException();
    }

    delete formSubmission.author;

    this.formSubRepository.merge(formSubmission, updateFormSubmissionDto);

    return formSubmission.save();
  }

  // This is set aside for future character logic.
  // findOneCharacter(id: number): Promise<FormCharacter> {
  //   return this.repository.query(
  //     `
  // SELECT c.id, c.name, c.realm, c.region, jsonb_agg(jsonb_insert(slot, '{media, assets}', jsonb_build_array(jsonb_build_object('key', asset.type, 'value', asset.value)))) AS equipment
  // FROM form_character c, jsonb_array_elements(c.equipment) slot
  // JOIN wow_assets asset on asset.id = (slot->'item'->'id')::integer
  // WHERE c.id = $1
  // GROUP BY c.id;
  //   `,
  //     [id],
  //   );
  // }
}
