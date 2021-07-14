import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly limit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly offset?: number;
}
