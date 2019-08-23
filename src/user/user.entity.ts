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
} from 'typeorm';
import { Roles } from '../app.roles';
import { Article } from '../article/article.entity';
import { Comment } from '../application/comment/comment.entity';
import { Character } from '../warcraft/character/character.entity';

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
}
