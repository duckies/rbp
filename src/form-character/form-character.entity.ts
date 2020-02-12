import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { RealmSlug } from '../blizzard/enum/realm.enum';
import { Region } from '../blizzard/enum/region.enum';
import { EquippedItemsEntity } from '../blizzard/interfaces/profile-equipment.interface';
import {
  TalentMeta,
  ProfileSpecializations,
  SpecializationMeta,
} from '../blizzard/interfaces/profile-specializations.interface';
import { FormSubmission } from '../form-submission/form-submission.entity';

@Entity('form_character')
@Unique('Unique_Main', ['id', 'name', 'realm', 'region', 'isMain'])
export class FormCharacter extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

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
  equipment?: EquippedItemsEntity[];

  @Column({ nullable: true })
  specialization_id?: number;

  @Column({ nullable: true })
  specialization_name?: string;

  @Column({ type: 'jsonb', nullable: true })
  specializations?: SpecializationMeta[];

  /**
   * Form Character Relations
   */

  @ManyToOne(
    () => FormSubmission,
    formSubmission => formSubmission.characters,
    { onDelete: 'CASCADE' },
  )
  submission: FormSubmission;
}
