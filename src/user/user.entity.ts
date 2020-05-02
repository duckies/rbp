import { Collection, Entity, OneToMany, PrimaryKey, Property, WrappedEntity } from 'mikro-orm';
import { EnumArray } from '../../config/types/enum-array.type';
import { Roles } from '../app.roles';
import { Article } from '../article/article.entity';
import { FileUpload } from '../file/file.entity';
import { FormComment } from '../form-comment/form-comment.entity';
import { FormSubmission } from '../form-submission/form-submission.entity';

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  discord_id!: string;

  @Property()
  discord_username!: string;

  @Property()
  discord_discriminator!: string;

  @Property({ hidden: true })
  discord_access_token?: string;

  @Property({ hidden: true })
  discord_refresh_token?: string;

  @Property()
  discord_avatar?: string;

  @Property({ hidden: true })
  blizzard_token?: string;

  @Property({ type: EnumArray })
  roles: Roles[] = [];

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  @OneToMany(() => FormSubmission, (submission) => submission.author)
  submissions = new Collection<FormSubmission>(this);

  @OneToMany(() => FormComment, (comment) => comment.author)
  comments = new Collection<FormComment>(this);

  @OneToMany(() => FileUpload, (fileUpload) => fileUpload.author)
  files: FileUpload[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface User extends WrappedEntity<User, 'id'> {}
