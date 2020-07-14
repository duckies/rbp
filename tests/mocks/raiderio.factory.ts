import CharacterRaiderIOMock from './character-raiderio.mock';

export class RaiderIOFactory {
  constructor(private readonly name: string) {}

  async getCharacterRaiderIO() {
    return CharacterRaiderIOMock(this.name);
  }
}
