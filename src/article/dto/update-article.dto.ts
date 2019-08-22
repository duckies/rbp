import { IsNotEmpty, Length, IsOptional } from 'class-validator';

export class UpdateArticleDto {
  @IsOptional()
  @Length(10, 120)
  readonly title?: string;

  @IsOptional()
  @Length(10, 120)
  readonly subtitle?: string;

  @IsOptional()
  content?: string;

  @IsOptional()
  header?: string;
}