import { IsUUID } from 'class-validator';

export class FindFileDto {
  @IsUUID()
  id: string;
}
