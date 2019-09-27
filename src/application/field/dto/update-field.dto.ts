import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, ValidateNested } from 'class-validator';

export class FieldAttribute {
  [key: string]: any;
}

export class FieldOptions {
  @IsOptional()
  @Type(() => FieldAttribute)
  attrs?: FieldAttribute[];

  @IsOptional()
  @IsString({ each: true })
  choices?: string[];

  @IsOptional()
  @IsBoolean()
  multiple?: boolean;
}

export class UpdateFieldDto {
  @IsOptional()
  readonly order: number;

  @IsOptional()
  readonly question: string;

  @IsOptional()
  @IsString()
  readonly label?: string;

  @IsOptional()
  readonly hint?: string;

  @IsOptional()
  readonly isRequired: boolean;

  @IsOptional()
  @Type(() => FieldOptions)
  @ValidateNested()
  readonly options?: FieldOptions;
}
