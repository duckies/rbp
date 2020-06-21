import { Cascade, Entity, ManyToOne, PrimaryKey, Property, WrappedEntity } from 'mikro-orm';
import { User } from '../user/user.entity';

@Entity()
export class Article {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  title!: string;

  @Property()
  slug!: string;

  @Property()
  subtitle!: string;

  @Property()
  content!: string;

  @Property()
  header?: string;

  @ManyToOne({ eager: true, cascade: [Cascade.ALL] })
  author: User;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Article extends WrappedEntity<Article, 'id'> {}
