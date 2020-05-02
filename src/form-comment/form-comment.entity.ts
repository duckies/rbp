import { Entity, ManyToOne, PrimaryKey, Property } from 'mikro-orm';
import { User } from '../user/user.entity';

@Entity()
export class FormComment {
  @PrimaryKey()
  id!: number;

  @Property()
  message!: string;

  @ManyToOne()
  user!: User;

  @ManyToOne()
  author!: User;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
