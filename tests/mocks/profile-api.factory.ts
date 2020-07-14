import { AxiosResponse } from 'axios';
import CharacterMediaSummaryMock from './character-media-summary.mock';
import CharacterProfileSummaryMock from './character-profile-summary.mock';
import CharacterRaids from './character-raids.mock';
import CharacterSpecializationSummaryMock from './character-specialization-summary.mock';

export class ProfileAPIFactory {
  private readonly axiosResponse: AxiosResponse = {
    data: null,
    status: 200,
    statusText: 'testing',
    headers: {},
    config: null,
    request: null,
  };

  constructor(private readonly id: number, private readonly name: string) {}

  async getCharacterProfileSummary() {
    return Object.assign(this.axiosResponse, {
      data: CharacterProfileSummaryMock(this.id, this.name),
    });
  }

  async getCharacterSpecializationSummary() {
    return Object.assign(this.axiosResponse, {
      data: CharacterSpecializationSummaryMock(this.id, this.name),
    });
  }

  async getCharacterMediaSummary() {
    return Object.assign(this.axiosResponse, {
      data: CharacterMediaSummaryMock(this.id, this.name),
    });
  }

  async getCharacterRaids() {
    return Object.assign(this.axiosResponse, {
      data: CharacterRaids(this.id, this.name),
    });
  }

  async getCharacterEquipmentSummary() {
    return Object.assign(this.axiosResponse, {
      data: CharacterSpecializationSummaryMock(this.id, this.name),
    });
  }
}
