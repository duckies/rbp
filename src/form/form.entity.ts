import { Collection, Entity, OneToMany, PrimaryKey, Property, QueryOrder } from 'mikro-orm';
import { FormQuestion } from '../form-question/question.entity';
import { FormSubmission } from '../form-submission/form-submission.entity';

@Entity()
export class Form {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @OneToMany(() => FormQuestion, (question) => question.form, {
    eager: true,
    orderBy: { order: QueryOrder.ASC },
  })
  questions = new Collection<FormQuestion>(this);

  @OneToMany(() => FormSubmission, (submission) => submission.form)
  submissions = new Collection<FormSubmission>(this);

  @Property({ default: new Date() })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
