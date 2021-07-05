import { IsDate } from 'class-validator';

export class FindRaidNightDTO {
  @IsDate()
  readonly start!: Date;

  @IsDate()
  readonly end!: Date;
}
