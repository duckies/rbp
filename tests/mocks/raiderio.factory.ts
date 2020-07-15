import CharacterRaiderIOMock from './character-raiderio.mock';

export class RaiderIOFactory {
  async getCharacterRaiderIO(name: string) {
    return CharacterRaiderIOMock(name);
  }
}
