import { Entity, PrimaryKey, Property } from 'mikro-orm';

@Entity()
export class Slide {
  @PrimaryKey()
  id!: number;

  @Property()
  image!: string;

  @Property()
  title!: string;

  @Property()
  subtitle?: string;

  @Property()
  link?: string;
}
