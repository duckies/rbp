<<<<<<< HEAD
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindCharacterDto } from '../blizzard/dto/find-character.dto';
import { GameDataService } from '../blizzard/game-data-api.service';
import { ProfileCharacter, ProfileEquipment, ProfileMedia } from '../blizzard/interfaces';
import { ProfileApiService } from '../blizzard/profile-api.service';
import { FormCharacter } from '../form-character/form-character.entity';
import { FormSubmissionReadService } from '../form-submission-seen/form-submission-read.service';
=======
import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { Repository } from 'typeorm';
import { FindCharacterDto } from '../blizzard/dto/find-character.dto';
import { GameDataService } from '../blizzard/game-data.service';
import { ProfileService } from '../blizzard/profile.service';
import { RateLimiter } from '../blizzard/rate-limiter.service';
import { FormCharacter } from '../form-character/form-character.entity';
import { RaiderIOCharacterFields } from '../raiderIO/dto/char-fields.dto';
import { RaiderIOService } from '../raiderIO/raiderIO.service';
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
import { User } from '../user/user.entity';
import { CreateFormSubmissionDto, UpdateFormSubmissionDto } from './dto';
import { FormSubmissionStatus } from './enums/form-submission-status.enum';
import { FormSubmission } from './form-submission.entity';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(FormSubmission)
    private readonly formSubRepository: Repository<FormSubmission>,
<<<<<<< HEAD
    private readonly formSubmissionReadService: FormSubmissionReadService,
    private readonly profileApiService: ProfileApiService,
    private readonly gameDataService: GameDataService,
=======
    private readonly profileService: ProfileService,
    private readonly gameDataService: GameDataService,
    private readonly raiderIOService: RaiderIOService,
    private readonly rateLimiter: RateLimiter,
    @InjectQueue('form') private readonly queue: Queue,
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
  ) {}

  /**
   * Uses various profile media endpoints to build the initial character application information.
   * @param findCharacterDto FindCharacterDto
   * @param isMain Boolean determining if this is a main character.
   */
<<<<<<< HEAD
  async buildFormCharacter({ name, realm, region }: FindCharacterDto, isMain?: boolean): Promise<FormCharacter> {
    // There are promise.all() issues with Typescript 3.7, check on this later.
    const [data, media, equipment]: [
      ProfileCharacter | Error,
      ProfileMedia | Error,
      ProfileEquipment | Error,
    ] = await Promise.all([
      this.profileApiService.getCharacter({ name, realm, region }).catch(e => e),
      this.profileApiService.getCharacterMedia({ name, realm, region }).catch(e => e),
      this.profileApiService.getCharacterEquipment({ name, realm, region }).catch(e => e),
    ]);

    const character = new FormCharacter();

    character.name = name;
    character.realm = realm;
    character.region = region;
=======
  async buildFormCharacter(findCharacterDto: FindCharacterDto, isMain?: boolean): Promise<FormCharacter> {
    const [data, specs, media, equipment, raiderIO] = await Promise.all(
      [
        this.profileService.getCharacterProfileSummary(findCharacterDto),
        this.profileService.getCharacterSpecializationsSummary(findCharacterDto),
        this.profileService.getCharacterMediaSummary(findCharacterDto),
        this.profileService.getCharacterEquipmentSummary(findCharacterDto),
        this.raiderIOService.getCharacterRaiderIO(findCharacterDto, [
          RaiderIOCharacterFields.RAID_PROGRESSION,
          RaiderIOCharacterFields.MYTHIC_PLUS_SCORES_BY_CURRENT_AND_PREVIOUS_SEASON,
        ]),
      ].map(p => p.catch(e => e)),
    );

    const character = new FormCharacter();

    character.name = findCharacterDto.name;
    character.realm = findCharacterDto.realm;
    character.region = findCharacterDto.region;
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
    character.isMain = isMain || false;

    if (!(data instanceof Error)) {
      character.race_id = data.race.id;
      character.race_name = data.race.name;
      character.class_id = data.character_class.id;
      character.class_name = data.character_class.name;
      character.gender = data.gender.name;
    }

    if (!(media instanceof Error)) {
      character.avatar_url = media.avatar_url;
      character.bust_url = media.bust_url;
      character.render_url = media.render_url;
    }

<<<<<<< HEAD
=======
    if (!(specs instanceof Error)) {
      character.specialization_id = specs.active_specialization.id;
      character.specialization_name = specs.active_specialization.name;
      character.specializations = specs.specializations;
    }

>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
    if (!(equipment instanceof Error)) {
      character.equipment = equipment.equipped_items;

      // This may be faster running it immediately after `getCharacterMedia` completes.
      await Promise.all(
        equipment.equipped_items.map(slot => this.gameDataService.getGameItemMedia(slot.item.id, true)),
      );
    }

<<<<<<< HEAD
=======
    if (!(raiderIO instanceof Error)) {
      character.raiderIO = raiderIO;
    }

    return character;
  }

  // TODO: Abstract a generic character builder function.
  async getFormCharacterData(findCharacterDto: FindCharacterDto): Promise<FormCharacter> {
    const [data, specs, media, equipment, raiderIO] = await Promise.all([
      this.profileService.getCharacterProfileSummary(findCharacterDto),
      this.profileService.getCharacterSpecializationsSummary(findCharacterDto),
      this.profileService.getCharacterMediaSummary(findCharacterDto),
      this.profileService.getCharacterEquipmentSummary(findCharacterDto),
      this.raiderIOService.getCharacterRaiderIO(findCharacterDto, [
        RaiderIOCharacterFields.RAID_PROGRESSION,
        RaiderIOCharacterFields.MYTHIC_PLUS_SCORES_BY_CURRENT_AND_PREVIOUS_SEASON,
      ]),
    ]);

    const character = new FormCharacter();

    character.name = findCharacterDto.name;
    character.realm = findCharacterDto.realm;
    character.region = findCharacterDto.region;
    character.isMain = false;

    if (!(data instanceof Error)) {
      character.race_id = data.race.id;
      character.race_name = data.race.name;
      character.class_id = data.character_class.id;
      character.class_name = data.character_class.name;
      character.gender = data.gender.name;
    }

    if (!(media instanceof Error)) {
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
      character.equipment = await Promise.all(
        equipment.equipped_items.map(async slot => {
          const assets = (await this.gameDataService.getGameItemMedia(slot.item.id, true)).assets;

          slot.media.assets = assets[0];
          return slot;
        }),
      );
    }

    if (!(raiderIO instanceof Error)) {
      character.raiderIO = raiderIO;
    }

>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
    return character;
  }

  /**
   * Creates a new form submission for a user with associated
   * answers and characters.
   * @param author Form submission author.
   * @param createSubmissionDto CreateSubmissionDto
   */
  async create(author: User, { formId, answers, characters }: CreateFormSubmissionDto): Promise<FormSubmission> {
<<<<<<< HEAD
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
=======
    const openForm = await this.formSubRepository.find({
      where: { status: FormSubmissionStatus.Open, authorId: author.id },
      select: ['author'],
    });

    if (openForm.length) {
      throw new BadRequestException(
        'You already have an open form. Please wait for your other application to be processed or cancel it.',
      );
    }
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028

    const [mainCharacter, ...altCharacters] = characters;

    const formCharacters = await Promise.all([
      this.buildFormCharacter(mainCharacter, true),
      ...altCharacters.map(alt => this.buildFormCharacter(alt)),
    ]);

    const submission = await this.formSubRepository.save({ formId, answers, characters: formCharacters, author });

    submission.justSubmitted = true;

<<<<<<< HEAD
=======
    await this.queue.add('newApplication', submission);

>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
    return submission;
  }

  /**
   * Finds an individual form submission.
   * @param id Form submission id.
   */
<<<<<<< HEAD
  findOne(id: number): Promise<FormSubmission> {
    return this.formSubRepository.findOneOrFail(id, {
      relations: ['form', 'author', 'characters', 'seenFormSubmissions'],
    });
=======
  async findOne(id: number): Promise<FormSubmission> {
    const data = await this.formSubRepository.query(
      `WITH characters AS
            (
                SELECT char.id,
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
                      jsonb_agg(jsonb_insert(slot, '{
                        media,
                        assets
                      }', jsonb_build_object('key', asset.type, 'value', asset.value))) as equipment,
                      char."raiderIO",
                      char."updatedAt"
                FROM form_character char,
                    jsonb_array_elements(char.equipment) slot
                        JOIN wow_assets asset on asset.id = (slot -> 'item' -> 'id')::integer
                WHERE char."submissionId" = $1
                GROUP BY char.id
                ORDER BY char.id
            )
      SELECT s.id,
          s.answers,
          s."formId",
          s."authorId",
          s.status,
          s."createdAt",
          json_build_object(
                  'id', u.id,
                  'discord_id', u."discord_id",
                  'discord_avatar', u."discord_avatar",
                  'discord_username', u."discord_username",
                  'discord_discriminator', u."discord_discriminator"
              ) as author,
          json_build_object(
                  'id', f.id,
                  'questions', json_agg(DISTINCT q.*)
              )                           as form,
          json_agg(DISTINCT characters.*) as characters
      FROM characters,
        form_submission s
            JOIN form f ON s."formId" = f.id
            JOIN form_question q ON q."formId" = f.id
            JOIN "user" u on s."authorId" = u.id
      WHERE s.id = $1
      GROUP BY s.id, f.id, u.id;
    `,
      [id],
    );

    if (data.length === 0) {
      throw new NotFoundException();
    }

    return data[0];
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
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
<<<<<<< HEAD
        'author.displayname',
        'author.avatar',
        'author.customAvatar',
=======
        'author.nickname',
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
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
<<<<<<< HEAD
      query = query.leftJoinAndSelect('submission.seenFormSubmissions', 'seen', 'seen.userId = :uId', { uId: user.id });
=======
      query = query.leftJoinAndSelect('submission.readFormSubmissions', 'read', 'read.userId = :uId', { uId: user.id });
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
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
<<<<<<< HEAD
  //   SELECT c.id, c.name, c.realm, c.region, jsonb_agg(jsonb_insert(slot, '{media, assets}', jsonb_build_array(jsonb_build_object('key', asset.type, 'value', asset.value)))) AS equipment
  //   FROM form_character c, jsonb_array_elements(c.equipment) slot
  //   JOIN wow_assets asset on asset.id = (slot->'item'->'id')::integer
  //   WHERE c.id = $1
  //   GROUP BY c.id;
=======
  // SELECT c.id, c.name, c.realm, c.region, jsonb_agg(jsonb_insert(slot, '{media, assets}', jsonb_build_array(jsonb_build_object('key', asset.type, 'value', asset.value)))) AS equipment
  // FROM form_character c, jsonb_array_elements(c.equipment) slot
  // JOIN wow_assets asset on asset.id = (slot->'item'->'id')::integer
  // WHERE c.id = $1
  // GROUP BY c.id;
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
  //   `,
  //     [id],
  //   );
  // }
}
