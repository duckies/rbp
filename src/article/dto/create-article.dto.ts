import { IsNotEmpty, Length } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty()
  @Length(10, 120)
  readonly title: string;

  @IsNotEmpty()
  @Length(10, 120)
  readonly subtitle: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  header: string;
}