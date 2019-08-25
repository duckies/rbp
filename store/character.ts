import { GetterTree, MutationTree, ActionTree } from 'vuex/types/index'
import { User } from './auth'

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
  errors: Error[]
  character: Character | undefined
  roster: Character[]
}

export const state = (): CharacterState => ({
  status: 'unloaded',
  errors: [],
  character: undefined,
  roster: []
})

export const getters: GetterTree<CharacterState, CharacterState> = {
  character(state: CharacterState): Character | undefined {
    return state.character
  },
  roster(state: CharacterState): Character[] {
    return state.roster
  }
}

export const mutations: MutationTree<CharacterState> = {
  setStatus(state: CharacterState, status: string): void {
    state.status = status
  },
  addError(state: CharacterState, error: Error): void {
    state.errors.unshift(error)
  },
  popError(state: CharacterState): void {
    state.errors.pop()
  },
  setCharacter(state: CharacterState, character: Character): void {
    state.character = character
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
  }
}
