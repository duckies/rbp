import { ActionTree, GetterTree, MutationTree } from 'vuex'

import { ProfileEquipment } from '../interfaces/profile/profile-equipment.interface'
import { ProfileSpecializations, Specialization } from '../interfaces/profile/profile-specializations.interface'
import { CharacterRaiderIO } from '../interfaces/raiderIO/character.interface'
import { User } from './user'
import { RaiderIOCharacter } from './raiderIO'
import { RootState } from '.'
// import { RaiderIOCharacter } from './raiderIO'
// import { User } from './auth'

// const FIFTEEN_MINUTES = 1000 * 60 * 16

export interface FindCharacterDto {
  name: string
  realm: string
  region: string
}

export interface FormCharacter {
  id: number
  name: string
  realm: string
  region: string
  equipment?: ProfileEquipment
  submissionId?: number
  isMain?: number
  avatar_url?: string
  bust_url?: string
  render_url?: string
  race_id?: number
  race_name?: string
  class_id?: number
  class_name?: string
  gender?: string
  specializations?: ProfileSpecializations
  specialization_id?: number
  specialization_name?: string
  raiderIO?: CharacterRaiderIO
  updatedAt: Date
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
  // Optional
  specialization_id?: number
  specialization_name?: string
  specializations?: Specialization
}

export interface CharacterRequest {
  name: string
  realm: string
  region: string
}

export const state = () => ({
  status: 'unloaded',
  error: null as Error | null,
  roster: [] as Character[],
  knownCharacters: [] as KnownCharacter[],
})

export type RosterState = ReturnType<typeof state>

export const getters: GetterTree<RosterState, RootState> = {
  isLoading: (state) => state.status === 'loading',
}

export const mutations: MutationTree<RosterState> = {
  setStatus(state, data: { status: string; error?: Error }) {
    state.status = data.status
    state.error = data.error || null
  },
  setRoster(state, characters: Character[]) {
    state.roster = characters
  },
  setKnownCharacters(state, characters: KnownCharacter[]) {
    state.knownCharacters = characters
  },
}

export const actions: ActionTree<RosterState, RootState> = {
  async getRoster({ commit }) {
    try {
      commit('setStatus', { status: 'loading' })
      const resp = await this.$axios.$get('/characters/roster')

      commit('setStatus', { status: 'success' })
      commit('setRoster', resp)
    } catch (error) {
      commit('setStatus', { status: 'error', error })
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getCharacterData({ commit }, { name, realm, region }: FindCharacterDto): Promise<FormCharacter> {
    return this.$axios.$get(`/form-character/${region}/${realm}/${name}`)
  },
  async getKnownCharacters({ commit }) {
    try {
      commit('setStatus', { status: 'loading' })
      const resp = await this.$axios.$get('/characters/known')

      commit('setStatus', { status: 'success' })
      commit('setKnownCharacters', resp)
    } catch (error) {
      commit('setStatus', { status: 'error', error })
    }
  },
}
