import {
  ArrayType,
  BaseEntity,
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Roles } from '../app.roles';
import { Post } from '../post/post.entity';
import { FileUpload } from '../file/file.entity';
import { FormComment } from '../form-comment/form-comment.entity';
import { FormSubmission } from '../form-submission/form-submission.entity';

@Entity()
export class User extends BaseEntity<User, 'id'> {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  discord_id!: string;

  @Property()
  discord_username!: string;

  @Property()
  discord_discriminator!: string;

  @Property({ hidden: true, nullable: true })
  discord_access_token?: string;

  @Property({ hidden: true, nullable: true })
  discord_refresh_token?: string;

  @Property({ nullable: true })
  discord_avatar?: string;

  @Property({ hidden: true, nullable: true })
  blizzard_token?: string;

  @Property({ type: ArrayType })
  roles: Roles[] = [];

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ persist: false })
  get discord_tag() {
    if (!this.discord_username || !this.discord_discriminator) return null;

    return `${this.discord_username}#${this.discord_discriminator}`;
  }

  @Property({ persist: false })
  get avatar() {
    if (this.discord_avatar) {
      const base = `https://cdn.discordapp.com/avatars/${this.discord_id}/${this.discord_avatar}`;

      if (this.discord_avatar.endsWith('a_')) {
        return `${base}.gif`;
      } else {
        return `${base}.png`;
      }
    }

    return `/images/avatars/default/${this.id % 10}.jpg`;
  }

  @OneToMany(() => Post, (a) => a.author, { hidden: true })
  posts = new Collection<Post>(this);

  @OneToMany(() => FormSubmission, (submission) => submission.author, {
    hidden: true,
  })
  submissions = new Collection<FormSubmission>(this);

  @OneToMany(() => FormComment, (comment) => comment.author, { hidden: true })
  comments = new Collection<FormComment>(this);

  @OneToMany(() => FileUpload, (fileUpload) => fileUpload.author, {
    hidden: true,
  })
  files = new Collection<FileUpload>(this);
}
