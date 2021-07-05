import CharacterRaiderIOMock from './character-raiderio.mock';

export class RaiderIOServiceMock {
  getCharacterRaiderIO(name: string) {
    return CharacterRaiderIOMock(name);
  }
}
