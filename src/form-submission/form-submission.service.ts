import { EntityRepository } from '@mikro-orm/knex';
import { InjectQueue } from '@nestjs/bull';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Queue } from 'bull';
import { EntityManager, QueryOrder, wrap } from '@mikro-orm/core';
import { InjectRepository } from 'nestjs-mikro-orm';
import { FileService } from '../file/file.service';
import { FormCharacterService } from '../form-character/form-character.service';
import { Form } from '../form/form.entity';
import { User } from '../user/user.entity';
import { CreateFormSubmissionDto, UpdateFormSubmissionDto } from './dto';
import { FormSubmissionStatus } from './enums/form-submission-status.enum';
import { FormSubmission } from './form-submission.entity';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(FormSubmission)
    private readonly formSubmissionRepository: EntityRepository<FormSubmission>,
    private readonly formCharacterService: FormCharacterService,
    private readonly fileService: FileService,
    private readonly em: EntityManager,
    @InjectQueue('form') private readonly formQueue: Queue,
    @InjectQueue('discord') private readonly discordQueue: Queue,
  ) {}

  /**
   * Creates a new form submission for a user with associated
   * answers and characters.
   * @param author Form submission author.
   * @param createSubmissionDto CreateSubmissionDto
   */
  async create(
    author: User,
    { formId, answers, files, characters }: CreateFormSubmissionDto,
  ) {
    const formSubmission = new FormSubmission();

    const openForm = await this.formSubmissionRepository.find(
      {
        status: FormSubmissionStatus.Open,
        author: { id: author.id },
      },
      ['author'],
    );

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

      formSubmission.files.set(fileUploads);
    }

    const formCharacters = await Promise.all(
      characters.map((character) =>
        this.formCharacterService.upsert(character),
      ),
    );

    formSubmission.form = this.em.getReference(Form, formId);
    formSubmission.author = author;
    formSubmission.characters.set(formCharacters);
    formSubmission.mainCharacter = formCharacters[0];
    formSubmission.answers = answers;

    await this.formSubmissionRepository.persistAndFlush(formSubmission);

    // When not using the populate API, this needs to be manually set.
    formSubmission.author.populated();
    formSubmission.characters.populated();
    formSubmission.justSubmitted = true;

    // Send notifications.
    await this.formQueue.add('newApplication', formSubmission);
    await this.discordQueue.add('APP_CREATE_NOTIFICATION', formSubmission);

    return formSubmission;
  }

  /**
   * Retrieves the first available form submission for a given status.
   * @param status FormSubmissionStatus
   */
  findFirstByStatus(status: FormSubmissionStatus) {
    // This intentionally does not fail so it does not pass the 404 error.
    return this.formSubmissionRepository.findOneOrFail(
      { status },
      ['form', 'author', 'characters'],
      {
        id: QueryOrder.DESC,
      },
    );
  }

  /**
   * Retrieves all forms created by an author regardless of status.
   * @param user Form submission author.
   */
  findByUser(user: User) {
    return this.formSubmissionRepository
      .createQueryBuilder('s')
      .select(['s.id', 's.status'])
      .join('s.author', 'author')
      .where('author.id = :id', [user.id])
      .getResult();
  }

  /**
   * Finds the first open form submission by a user, if available.
   * Used to determine if a user has already submitted an application.
   * @param user Form submission author.
   */
  findOpenByUser(user: User): Promise<Pick<FormSubmission, 'id' | 'status'>> {
    return this.formSubmissionRepository.findOne({
      author: { id: user.id },
      status: FormSubmissionStatus.Open,
    });
  }

  /**
   * Finds an open form submission by a discord identifier.
   * @param id
   */
  findOpenByUserDiscordID(id: string) {
    return this.formSubmissionRepository.findOne({
      author: { discord_id: id },
      status: FormSubmissionStatus.Open,
    });
  }

  /**
   * Finds an individual form submission.
   * @param id Form submission id.
   */
  async findOne(id: number) {
    return this.formSubmissionRepository.findOne({ id }, [
      'author',
      'characters',
      'files',
      'form',
    ]);
  }

  /**
   * Retrieving a paginated array of form submissions.
   * Search narrowable to status category by an optionally provided status or id.
   *
   * @param take Number of submissions to retrieve.
   * @param skip Number of submissions to skip.
   */
  async findAll(
    limit?: number,
    offset?: number,
    status?: FormSubmissionStatus,
  ) {
    const submissions = await this.formSubmissionRepository.findAndCount(
      { status },
      ['author', 'characters'],
      { id: QueryOrder.DESC },
      limit,
      offset,
    );

    return submissions;
  }

  /**
   * Updates a form.
   * @param id Form submission id.
   * @param updateFormSubmissionDto UpdateFormSubmissionDto
   * @param updateAny Describes if the user has has officer-level permissions over applications.
   */
  async update(
    id: number,
    user: User,
    updateFormSubmissionDto: UpdateFormSubmissionDto,
    updateAny: boolean,
  ) {
    const formSubmission = await this.formSubmissionRepository.findOneOrFail(
      id,
      ['author'],
    );

    if (!updateAny && formSubmission.author.id !== user.id) {
      throw new ForbiddenException();
    }

    // Only officers can change the status of applications to anything other than cancelled.
    if (
      !updateAny &&
      updateFormSubmissionDto.status &&
      updateFormSubmissionDto.status !== FormSubmissionStatus.Cancelled
    ) {
      throw new ForbiddenException();
    }

    const statusChange =
      updateFormSubmissionDto.status &&
      updateFormSubmissionDto.status !== 'open' &&
      formSubmission.status !== updateFormSubmissionDto.status;

    wrap(formSubmission).assign(updateFormSubmissionDto);

    await this.formSubmissionRepository.flush();

    if (statusChange) {
      await this.discordQueue.add('APP_STATUS_NOTIFICATION', formSubmission);
    }

    return formSubmission;
  }

  /**
   * Deletes a form submission.
   * @param id
   */
  async delete(id: number) {
    const submission = await this.formSubmissionRepository.findOneOrFail(id, [
      'characters',
    ]);

    this.formSubmissionRepository.remove(submission, true);

    return submission;
  }
}
