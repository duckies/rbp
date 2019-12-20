import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateArticleDto {
  @IsString()
  @Length(10, 120)
  @IsOptional()
  readonly title?: string;

  @IsString()
  @Length(10, 120)
  @IsOptional()
  readonly subtitle?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  header?: string;
}
