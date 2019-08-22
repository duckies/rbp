import { IsNotEmpty } from 'class-validator';

export enum GuildFields {
  Members = 'members',
  Achievements = 'achievements',
  News = 'news',
  Challenge = 'challenge',
}

export class GuildFieldsDto {
  @IsNotEmpty()
  fields: GuildFields[] = [
    GuildFields.Members
  ]
}