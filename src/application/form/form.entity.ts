import {
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Entity,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../user/user.entity';
import { CharacterResponse } from '../../warcraft/interfaces/character-response.interface';
import { RealmName } from '../../warcraft/interfaces/realm.enum';
import { Comment } from '../comment/comment.entity';
import { FormStatus } from './form-status.enum';

@Entity('form')
export class Form extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: FormStatus })
  status: FormStatus

  @Column({ type: 'jsonb' })
  fields: any;

  @Column()
  characterName: string;

  @Column({ type: 'enum', enum: RealmName })
  characterRealm: RealmName;

  @Column()
  characterRegion: string;

  @Column({ type: 'jsonb', nullable: true })
  characterData: CharacterResponse;

  @ManyToOne(type => User, user => user.forms)
  author: User;

  @ManyToMany(type => Comment)
  @JoinTable()
  comments: Comment[];
}
