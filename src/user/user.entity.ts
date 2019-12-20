import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Roles } from '../app.roles';
import { Comment } from '../application/comment/comment.entity';
import { Article } from '../article/article.entity';
import { File } from '../file/file.entity';
import { Character } from '../warcraft/character/character.entity';
import KnownCharacter from './interfaces/known-character.interface';

import moment = require('moment');

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  displayname: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: false })
  customAvatar: boolean;

  @Column({ nullable: false })
  battletag: string;

  @Column({ nullable: true })
  blizzardid: number;

  @Column({ nullable: true })
  blizzardtoken: string;

  @Column({ nullable: true })
  blizzardTokenExpiration: Date;

  @Column({ type: 'enum', enum: Roles, default: [Roles.Guest], array: true })
  roles: Roles[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  lastLogin: Date;

  @OneToMany(() => Article, article => article.author)
  articles: Article[];

  @OneToMany(() => Comment, comment => comment.author)
  comments: Comment[];

  @OneToMany(() => File, file => file.owner)
  files: File[];

  @OneToOne(() => Character, { eager: false })
  @JoinColumn()
  mainCharacter: Character;

  @OneToMany(() => Character, character => character.account, {
    cascade: true,
  })
  characters: Character[];

  @Column({ type: 'jsonb', nullable: true })
  knownCharacters: KnownCharacter[];

  @Column({ nullable: true })
  knownCharactersLastUpdated: Date;

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
    return moment(this.knownCharactersLastUpdated)
      .add(minutes, 'minutes')
      .isAfter(new Date());
  }
}
