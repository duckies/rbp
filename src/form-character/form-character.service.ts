import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FormCharacter } from "./form-character.entity";

@Injectable()
export class FormCharacterService {
  constructor(@InjectRepository(FormCharacter) private readonly repository: FormCharacter) {}

  build
}