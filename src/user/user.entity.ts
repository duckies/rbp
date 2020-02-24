import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Roles } from '../app.roles';
import { Article } from '../article/article.entity';
<<<<<<< HEAD
import { KnownCharacter } from '../blizzard/interfaces/profile/known-characters.interface';
import { Character } from '../character/character.entity';
import { File } from '../file/file.entity';
import { FormSubmissionRead } from '../form-submission-seen/form-submission-read.entity';
import { FormSubmission } from '../form-submission/form-submission.entity';

import moment = require('moment');
=======
import { Character } from '../character/character.entity';
import { FormSubmissionRead } from '../form-submission-seen/form-submission-read.entity';
import { FormSubmission } from '../form-submission/form-submission.entity';

import moment from 'moment';
import { ProfileKnownCharacter } from '../blizzard/interfaces/profile/account-profile/account-profile-summary.interface';
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
<<<<<<< HEAD
  displayname: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: false })
  customAvatar: boolean;

  @Column({ nullable: false })
=======
  nickname: string;

  @Column({ nullable: true })
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
  battletag: string;

  @Column({ nullable: true, select: false })
  blizzardid: number;

  @Column({ nullable: true, select: false })
  blizzardtoken: string;

  @Column({ nullable: true, select: false })
  blizzardTokenExpiration: Date;

<<<<<<< HEAD
=======
  @Column()
  discord_id?: string;

  @Column({ nullable: true })
  discord_username?: string;

  @Column({ nullable: true })
  discord_discriminator?: string;

  @Column({ nullable: true, select: false })
  discord_access_token?: string;

  @Column({ nullable: true, select: false })
  discord_refresh_token?: string;

  @Column({ nullable: true })
  discord_avatar?: string;

>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
  @Column({ type: 'enum', enum: Roles, default: [Roles.Guest], array: true })
  roles: Roles[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  lastLogin: Date;

  @OneToMany(
    () => Article,
    article => article.author,
  )
  articles: Article[];

  // Not yet implemented.
  // @OneToMany(() => Comment, comment => comment.author)
  // comments: Comment[];

<<<<<<< HEAD
  @OneToMany(
    () => File,
    file => file.owner,
  )
  files: File[];

=======
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
  @OneToOne(() => Character, { eager: false })
  @JoinColumn()
  mainCharacter: Character;

  @OneToMany(
    () => Character,
    character => character.account,
    {
      cascade: true,
    },
  )
  characters: Character[];

  @Column({ type: 'jsonb', nullable: true, select: false })
<<<<<<< HEAD
  knownCharacters: KnownCharacter[];
=======
  knownCharacters: ProfileKnownCharacter[];
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028

  @Column({ nullable: true, select: false })
  knownCharactersLastUpdated: Date;

  @OneToMany(
    () => FormSubmission,
    formSubmission => formSubmission.author,
  )
  formSubmissions: FormSubmission[];

  /**
   * Notification or "Seen" Relations
   */
  @OneToMany(
    () => FormSubmissionRead,
    formSubmissionRead => formSubmissionRead.user,
  )
  readFormSubmissions: FormSubmissionRead;

  /**
   * Methods
   */

  @BeforeInsert()
  setToken(): void {
    if (this.blizzardtoken) {
      this.blizzardTokenExpiration = moment()
        .add(24, 'hours')
        .toDate();
    }
  }

  @BeforeUpdate()
  updateToken(): void {
    if (this.blizzardtoken === null) {
      this.blizzardTokenExpiration = null;
    } else {
      this.blizzardTokenExpiration = moment()
        .add(24, 'hours')
        .toDate();
    }
  }

  tokenExpired(): boolean {
    return (
      !this.blizzardtoken ||
      !this.blizzardTokenExpiration ||
      !moment(this.blizzardTokenExpiration).isSameOrAfter(new Date())
    );
  }

  charactersUpdatedWithin(minutes: number): boolean {
    if (!this.knownCharactersLastUpdated) return false;

    return moment(this.knownCharactersLastUpdated)
      .add(minutes, 'minutes')
      .isAfter(new Date());
  }
}
