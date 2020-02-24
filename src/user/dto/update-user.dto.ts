import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
<<<<<<< HEAD
  displayname?: string;
=======
  nickname?: string;
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028

  @IsOptional()
  avatar?: string;
}
