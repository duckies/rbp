import CharacterRaiderIOMock from './character-raiderio.mock';

export class RaiderIOServiceMock {
  async getCharacterRaiderIO(name: string) {
    return CharacterRaiderIOMock(name);
  }
}
