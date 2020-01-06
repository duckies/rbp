import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { $axios } from '../utils/axios'
import { RaiderIOCharacter } from './raiderIO'
import { User } from './auth'

const FIFTEEN_MINUTES = 1000 * 60 * 16

export interface FindCharacterDto {
  name: string
  realm: string
  region: string
}

export interface KnownCharacter {
  name: string
  realm: string
  region: string
  class: number
  race: number
  gender: number
  level: number
  thumbnail: string
  lastModified: number
  blizzard?: Character
  raiderIO?: RaiderIOCharacter
}

export interface Character {
  id: number
  character_id: number
  region: string
  realm: string
  name: string
  class_id: number
  class_name: string
  race_id: number
  race_name: number
  gender: string
  level: number
  avatar_url?: string
  bust_url?: string
  render_url?: string
  faction: string
  achievement_points: number
  guild_id?: number
  guild_name?: string
  guild_realm?: string
  guild_rank?: number
  title?: string
  items: JSON
  professions: JSON
  spec: string
  specIcon: string
  talents: JSON
  mountsCollected: number
  mountsNotCollected: number
  petsCollected: number
  progression: JSON
  pvp: JSON
  honorableKills: number
  lastModified: Date
  status: string
  retries: number
  account?: User
  missingSince: Date
  isDeleted: boolean
  notUpdated: boolean
}

export interface CharacterState {
  status: string
  error?: Error
  mainCharacter?: Character
  altCharacters: Character[]
  roster: Character[]
  knownCharacters: KnownCharacter[]
  knownCharactersLastUpdated?: Date
}

export interface CharacterRequest {
  name: string
  realm: string
  region: string
}

@Module({ name: 'character', namespaced: true, stateFactory: true })
export default class CharacterModule extends VuexModule {
  public status = 'unloaded'
  public error?: Error = undefined
  public mainCharacter?: Character | KnownCharacter
  public altCharacters: Character[] | KnownCharacter[] = []
  public roster: Character[] = []
  public knownCharacters: KnownCharacter[] = []
  public knownCharactersLastUpdated?: Date

  get isLoading(): boolean {
    return this.status === 'loading'
  }

  get knownCharacterDataStale(): boolean {
    if (!this.knownCharactersLastUpdated) return false

    const fifteenMinutesAgo = Date.now() - FIFTEEN_MINUTES

    return this.knownCharactersLastUpdated.getTime() < fifteenMinutesAgo
  }

  get applicationCharacters(): KnownCharacter[] {
    return this.knownCharacters.filter(c => c.level >= 110)
  }

  @Mutation
  setStatus(data: { status: string; error?: Error }): void {
    this.status = data.status
    this.error = data.error
  }

  @Mutation
  setMainCharacter(character: Character): void {
    this.mainCharacter = character
  }

  @Mutation
  setAltCharacters(characters: Character[]): void {
    this.altCharacters = characters
  }

  @Mutation
  setRoster(characters: Character[]): void {
    this.roster = characters
  }

  @Mutation
  setKnownCharacters(characters: KnownCharacter[]): void {
    this.knownCharacters = characters
  }

  @Action({ commit: 'setRoster' })
  async getRoster(): Promise<Character[]> {
    const data = await $axios.$get('/characters/roster')

    return data
  }

  @Action({ commit: 'setKnownCharacters', rawError: true })
  async getKnownCharacters(): Promise<KnownCharacter[]> {
    try {
      this.context.commit('setStatus', { status: 'loading' })
      const data = await $axios.$get('/characters/known')

      this.context.commit('setStatus', { status: 'success' })
      return data.knownCharacters
    } catch (error) {
      this.context.commit('setStatus', { status: 'error', error })
    }

    return []
  }

  @Action({ rawError: true })
  getCharacterData({ name, realm, region }: FindCharacterDto): Promise<Character> {
    return $axios.get(`/blizzard/character/${region}/${realm}/${name}`)
  }
}
