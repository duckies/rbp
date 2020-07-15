import { AxiosResponse } from 'axios';
import CharacterEquipmentSummaryMock from './character-equipment-summary.mock';
import CharacterMediaSummaryMock from './character-media-summary.mock';
import CharacterProfileSummaryMock from './character-profile-summary.mock';
import CharacterRaidsMock from './character-raids.mock';
import CharacterSpecializationsSummaryMock from './character-specialization-summary.mock';

export class ProfileServiceMock {
  private readonly axios: AxiosResponse = {
    data: null,
    status: 200,
    statusText: 'testing',
    headers: {},
    config: null,
    request: null,
  };

  constructor(public readonly id: number, public readonly name: string) {}

  private getAxiosResponse<T>(data: T): AxiosResponse<T> {
    return Object.assign({}, this.axios, { data });
  }

  async getCharacterProfileSummary() {
    return this.getAxiosResponse(
      CharacterProfileSummaryMock(this.id, this.name),
    );
  }

  async getCharacterSpecializationsSummary() {
    return this.getAxiosResponse(
      CharacterSpecializationsSummaryMock(this.id, this.name),
    );
  }

  async getCharacterMediaSummary() {
    return this.getAxiosResponse(CharacterMediaSummaryMock(this.id, this.name));
  }

  async getCharacterEquipmentSummary() {
    return this.getAxiosResponse(
      CharacterEquipmentSummaryMock(this.id, this.name),
    );
  }

  async getCharacterRaids() {
    return this.getAxiosResponse(CharacterRaidsMock(this.id, this.name));
  }
}
