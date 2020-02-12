import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindCharacterDto } from '../blizzard/dto/find-character.dto';
import { GameDataService } from '../blizzard/game-data-api.service';
import { ProfileCharacter, ProfileEquipment, ProfileMedia, ProfileSpecializations } from '../blizzard/interfaces';
import { ProfileApiService } from '../blizzard/profile-api.service';
import { FormCharacter } from '../form-character/form-character.entity';
import { FormSubmissionReadService } from '../form-submission-seen/form-submission-read.service';
import { User } from '../user/user.entity';
import { CreateFormSubmissionDto, UpdateFormSubmissionDto } from './dto';
import { FormSubmissionStatus } from './enums/form-submission-status.enum';
import { FormSubmission } from './form-submission.entity';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(FormSubmission)
    private readonly formSubRepository: Repository<FormSubmission>,
    private readonly formSubmissionReadService: FormSubmissionReadService,
    private readonly profileApiService: ProfileApiService,
    private readonly gameDataService: GameDataService,
  ) {}

  /**
   * Uses various profile media endpoints to build the initial character application information.
   * @param findCharacterDto FindCharacterDto
   * @param isMain Boolean determining if this is a main character.
   */
  async buildFormCharacter(findCharacterDto: FindCharacterDto, isMain?: boolean): Promise<FormCharacter> {
    // There are promise.all() issues with Typescript 3.7, check on this later.
    const [data, specs, media, equipment]: [
      ProfileCharacter | Error,
      ProfileSpecializations | Error,
      ProfileMedia | Error,
      ProfileEquipment | Error,
    ] = await Promise.all([
      this.profileApiService.getCharacter(findCharacterDto).catch(e => e),
      this.profileApiService.getCharacterSpecializations(findCharacterDto).catch(e => e),
      this.profileApiService.getCharacterMedia(findCharacterDto).catch(e => e),
      this.profileApiService.getCharacterEquipment(findCharacterDto).catch(e => e),
    ]);

    const character = new FormCharacter();

    character.name = findCharacterDto.name;
    character.realm = findCharacterDto.realm;
    character.region = findCharacterDto.region;
    character.isMain = isMain || false;

    if (!(data instanceof Error)) {
      character.race_id = data.race.id;
      character.race_name = data.race.name;
      character.class_id = data.character_class.id;
      character.class_name = data.character_class.name;
      character.gender = data.gender.name;
    }

    if (!(media instanceof Error)) {
      console.log(media);
      character.avatar_url = media.avatar_url;
      character.bust_url = media.bust_url;
      character.render_url = media.render_url;
    }

    if (!(specs instanceof Error)) {
      character.specialization_id = specs.active_specialization.id;
      character.specialization_name = specs.active_specialization.name;
      character.specializations = specs.specializations;
    }

    if (!(equipment instanceof Error)) {
      character.equipment = equipment.equipped_items;

      // This may be faster running it immediately after `getCharacterMedia` completes.
      await Promise.all(
        equipment.equipped_items.map(slot => this.gameDataService.getGameItemMedia(slot.item.id, true)),
      );
    }

    return character;
  }

  /**
   * Creates a new form submission for a user with associated
   * answers and characters.
   * @param author Form submission author.
   * @param createSubmissionDto CreateSubmissionDto
   */
  async create(author: User, { formId, answers, characters }: CreateFormSubmissionDto): Promise<FormSubmission> {
    const openForm = await this.formSubRepository
      .createQueryBuilder('submission')
      .leftJoinAndSelect('submission.author', 'user', 'user.id = :id', { id: author.id })
      .where('submission.status = :status', { status: FormSubmissionStatus.Open })
      .getOne();

    // if (openForm) {
    //   throw new BadRequestException(
    //     'You already have an open form. Please wait for your other application to be processed or cancel it.',
    //   );
    // }

    const [mainCharacter, ...altCharacters] = characters;

    const formCharacters = await Promise.all([
      this.buildFormCharacter(mainCharacter, true),
      ...altCharacters.map(alt => this.buildFormCharacter(alt)),
    ]);

    const submission = await this.formSubRepository.save({ formId, answers, characters: formCharacters, author });

    submission.justSubmitted = true;

    return submission;
  }

  /**
   * Finds an individual form submission.
   * @param id Form submission id.
   */
  async findOne(id: number): Promise<FormSubmission> {
    const data = await this.formSubRepository.query(
      `
      WITH characters AS
      (
          SELECT
                  char.id,
                  char.name,
                  char.realm,
                  char.region,
                  char."isMain",
                  char.avatar_url,
                  char.bust_url,
                  char.render_url,
                  char.race_id,
                  char.race_name,
                  char.class_id,
                  char.class_name,
                  char.gender,
                  char.specializations,
                  char.specialization_id,
                  char.specialization_name,
                  jsonb_agg(jsonb_insert(slot, '{media, assets}', jsonb_build_object('key', asset.type, 'value', asset.value))) as equipment
          FROM    form_character char,
                  jsonb_array_elements(char.equipment) slot
          JOIN    wow_assets asset on asset.id = (slot->'item'->'id')::integer
          WHERE   char."submissionId" = $1
          GROUP BY    char.id
          ORDER BY    char.id ASC
      )
      SELECT
          s.id,
          s.answers,
          s."formId",
          s."authorId",
          s.status,
          s."createdAt",
          json_build_object(
              'id', author.id
          ) as author,
          json_agg(characters) as characters,
          row_to_json(f) as form
      FROM characters, form_submission s
      JOIN form f ON s."formId" = f.id
      JOIN "user" author on s."authorId" = author.id
      WHERE s.id = 60
      GROUP BY s.id, author.id, f.id;
    `,
      [id],
    );

    if (data.length === 0) {
      throw new NotFoundException();
    }

    return data[0];
  }

  /**
   * Retrieves the first available form submission for a given status.
   * @param status FormSubmissionStatus
   */
  findFirstByStatus(status: FormSubmissionStatus): Promise<FormSubmission> {
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
  findByUser(user: User): Promise<FormSubmission[]> {
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
  findAll(
    take: number,
    skip: number,
    status?: FormSubmissionStatus,
    id?: number,
    user?: User,
  ): Promise<[FormSubmission[], number]> {
    let query = this.formSubRepository
      .createQueryBuilder('submission')
      .select([
        'submission.id',
        'submission.status',
        'submission.createdAt',
        'submission.formId',
        'author.id',
        'author.displayname',
        'author.avatar',
        'author.customAvatar',
        'author.battletag',
        'character.id',
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
      query = query.leftJoinAndSelect('submission.readFormSubmissions', 'read', 'read.userId = :uId', { uId: user.id });
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
  async update(id: number, updateFormSubmissionDto: UpdateFormSubmissionDto): Promise<FormSubmission> {
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
  async updateOwn(
    id: number,
    user: User,
    updateFormSubmissionDto: UpdateFormSubmissionDto,
  ): Promise<Partial<FormSubmission>> {
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
