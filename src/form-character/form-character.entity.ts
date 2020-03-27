import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { RealmSlug } from '../blizzard/enum/realm.enum';
import { Region } from '../blizzard/enum/region.enum';
import * as ProfileAPI from '../blizzard/interfaces/profile';
import { EquippedItem } from '../blizzard/interfaces/profile/character-equipment/character-equipment-summary.interface';
import { SpecializationMeta } from '../blizzard/interfaces/profile/character-specializations/character-specializations-summary.interface';
import { FormSubmission } from '../form-submission/form-submission.entity';
import { RaiderIOCharacter } from '../raiderIO/interfaces/raider-io-character.interface';

@Entity('form_character')
@Unique('Unique_Main', ['id', 'name', 'realm', 'region', 'isMain'])
export class FormCharacter extends BaseEntity {
  constructor(name: string, realm: RealmSlug = RealmSlug.Area52, region: Region = Region.US) {
    super();
    this.name = name;
    this.realm = realm;
    this.region = region;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ nullable: true })
  character_id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: RealmSlug })
  realm: RealmSlug;

  @Column({ type: 'enum', enum: Region, default: Region.US })
  region: Region;

  @Column({ default: false })
  isMain: boolean;

  @Column({ type: 'smallint', nullable: true })
  race_id: number;

  @Column({ nullable: true })
  race_name: string;

  @Column({ type: 'smallint', nullable: true })
  class_id: number;

  @Column({ nullable: true })
  class_name: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  average_item_level: number;

  @Column({ nullable: true })
  equipped_item_level: number;

  /**
   * Optional Character Data Fields
   */

  @Column({ nullable: true })
  avatar_url: string;

  @Column({ nullable: true })
  bust_url: string;

  @Column({ nullable: true })
  render_url: string;

  @Column({ type: 'jsonb', nullable: true })
  equipment?: EquippedItem[];

  @Column({ nullable: true })
  specialization_id?: number;

  @Column({ nullable: true })
  specialization_name?: string;

  @Column({ type: 'jsonb', nullable: true })
  specializations?: SpecializationMeta[];

  @Column({ type: 'jsonb', nullable: true })
  raiderIO?: RaiderIOCharacter;

  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Form Character Relations
   */

  @ManyToOne(
    () => FormSubmission,
    formSubmission => formSubmission.characters,
    { onDelete: 'CASCADE', cascade: ['insert'] },
  )
  submission: FormSubmission;

  /**
   * Updating Methods
   */

  setCharacterProfileSummary(data: ProfileAPI.CharacterProfileSummary) {
    if (!this.character_id) {
      this.character_id = data.id;
    }

    this.name = data.name;
    this.race_id = data.race.id;
    this.race_name = data.race.name;
    this.class_id = data.character_class.id;
    this.class_name = data.character_class.name;
    this.gender = data.gender.name;
    this.average_item_level = data.average_item_level;
    this.equipped_item_level = data.equipped_item_level;
  }

  setCharacterSpecializationsSummary(data: ProfileAPI.CharacterSpecializationsSummary) {
    this.specialization_id = data.active_specialization.id;
    this.specialization_name = data.active_specialization.name;
    this.specializations = data.specializations;
  }

  setCharacterMediaSummary(data: ProfileAPI.CharacterMediaSummary) {
    this.avatar_url = data.avatar_url;
    this.bust_url = data.bust_url;
    this.render_url = data.render_url;
  }

  setCharacterEquipmentSummary(data: ProfileAPI.CharacterEquipmentSummary) {
    this.equipment = data.equipped_items;
  }

  setCharacterRaiderIO(data: RaiderIOCharacter) {
    this.raiderIO = data;
  }
}
