import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Roles } from '../app.roles';
import { Article } from '../article/article.entity';
import { Comment } from '../application/comment/comment.entity';
import { Character } from '../warcraft/character/character.entity';
import { Form } from '../application/form/form.entity';
import { KnownCharacter } from './interfaces/known-character.interface';
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

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  lastLogin: Date;

  // Not persisted to database.
  // Instructs frontend that the user is new.
  justCreated: boolean;

  @OneToMany(type => Form, form => form.author)
  forms: Form[];

  @OneToMany(type => Article, article => article.author)
  articles: Article[];

  @OneToMany(type => Comment, comment => comment.author)
  comments: Comment[];

  @OneToOne(type => Character, { eager: false })
  @JoinColumn()
  mainCharacter: Character;

  @OneToMany(type => Character, character => character.account, {
    cascade: true,
  })
  characters: Character[];

  @Column({ type: 'jsonb', nullable: true, array: true })
  knownCharacters: KnownCharacter[];

  @Column({ nullable: true })
  knownCharactersLastUpdated: Date;

  @BeforeInsert()
  setToken() {
    if (this.blizzardtoken) {
      this.blizzardTokenExpiration = moment().add(24, 'hours').toDate();
    }
  }

  @BeforeUpdate()
  updateToken() {
    if (this.blizzardtoken === null) {
      this.blizzardTokenExpiration = null;
    } else {
      this.blizzardTokenExpiration = moment().add(24, 'hours').toDate();
    }
  }
}
