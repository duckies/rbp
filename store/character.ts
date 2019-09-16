import { GetterTree, MutationTree, ActionTree } from 'vuex/types/index'
import { User } from './auth'
import { RaiderIOCharacter } from './raiderIO'

const FIFTEEN_MINUTES = 1000 * 60 * 16

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
  region: string
  realm: string
  name: string
  class: number
  race: number
  gender: number
  level: number
  thumbnail: string
  faction: number
  achievementPoints: number
  guild: string
  guildRank: number
  items: JSON
  professions: JSON
  title: string
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
  character?: Character
  characters: Character[]
  roster: Character[]
  knownCharacters: KnownCharacter[]
  knownCharactersLastUpdated?: Date
}

export interface CharacterRequest {
  name: string
  realm: string
  region: string
}

export const state = (): CharacterState => ({
  status: 'unloaded',
  error: undefined,
  character: undefined,
  characters: [],
  roster: [],
  knownCharacters: [],
  knownCharactersLastUpdated: undefined
})

export const getters: GetterTree<CharacterState, CharacterState> = {
  character(state: CharacterState): Character | undefined {
    return state.character
  },
  characters(state: CharacterState): Character[] {
    return state.characters
  },
  roster(state: CharacterState): Character[] {
    return state.roster
  },
  knownCharacters(state: CharacterState): Character[] {
    return state.characters
  },
  knownCharactersLastUpdated(state: CharacterState): Date | undefined {
    return state.knownCharactersLastUpdated
  },
  status(state: CharacterState): string {
    return state.status
  },
  error(state: CharacterState): Error | undefined {
    return state.error
  },
  knownCharacterDataStale(state: CharacterState): boolean {
    if (!state.knownCharactersLastUpdated) return false

    const fifteenMinutesAgo = Date.now() - FIFTEEN_MINUTES

    return state.knownCharactersLastUpdated.getTime() < fifteenMinutesAgo
  }
}

export const mutations: MutationTree<CharacterState> = {
  setStatus(state: CharacterState, status: string): void {
    state.status = status
  },
  setError(state: CharacterState, error: Error): void {
    state.error = error
  },
  clearError(state: CharacterState): void {
    state.error = undefined
  },
  setCharacter(state: CharacterState, character: Character): void {
    state.character = character
  },
  setCharacters(state: CharacterState, characters: Character[]): void {
    state.characters = characters
  },
  setKnownCharacters(
    state: CharacterState,
    characters: KnownCharacter[]
  ): void {
    state.knownCharacters = characters
  },
  setKnownCharactersLastUpdated(
    state: CharacterState,
    lastUpdated: Date
  ): void {
    state.knownCharactersLastUpdated = new Date(lastUpdated)
  },
  setRoster(state: CharacterState, roster: Character[]): void {
    state.roster = roster
  }
}

export const actions: ActionTree<CharacterState, CharacterState> = {
  async getRoster({ commit }): Promise<void> {
    commit('setStatus', 'loading')

    try {
      const resp = await this.$axios.$get('/character/roster')

      commit('setStatus', 'success')
      commit('setRoster', resp)
    } catch (error) {
      commit('setStatus', 'error')
      commit('addError', error)
    }
  },

  async getUserCharactersFromBlizzard({ commit }): Promise<void> {
    commit('setStatus', 'loading')
    commit('clearError')

    try {
      const resp = await this.$axios.$get('/blizzard/characters/user')

      commit('setStatus', 'success')
      commit('setKnownCharacters', resp.knownCharacters)
      commit('setKnownCharactersLastUpdated', resp.knownCharactersLastUpdated)
    } catch (error) {
      commit('setStatus', 'error')
      commit('setError', error)
    }
  },

  async getKnownCharacters({ commit }): Promise<void> {
    commit('setStatus', 'loading')
    commit('clearError')

    try {
      const resp = await this.$axios.$get('/user/known_characters')

      commit('setStatus', 'success')
      commit('setCharacters', resp.knownCharacters)
      commit('setKnownCharactersLastUpdated', resp.knownCharactersLastUpdated)
    } catch (error) {
      commit('setStatus', 'error')
      commit('setError', error)
    }
  },

  async getAppCharacter(
    { commit },
    data: CharacterRequest
  ): Promise<Character | undefined> {
    commit('setStatus', 'loading')
    commit('clearError')

    try {
      const resp = await this.$axios.$get(
        `/blizzard/character/${data.region}/${data.realm}/${data.name}`
      )

      commit('setStatus', 'success')

      return resp
    } catch (error) {
      commit('setStatus', 'error')
      commit('setError', error)
    }

    return undefined
  }
}
