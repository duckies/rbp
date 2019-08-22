import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  displayname?: string;

  @IsOptional()
  avatar?: string;
}