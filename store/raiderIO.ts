import { GetterTree, MutationTree, ActionTree } from 'vuex/types/index'
import { AxiosResponse } from 'axios'

export enum Expansion {
  BATTLE_FOR_AZEROTH = 'Battle for Azeroth',
  LEGION = 'Legion'
}

export interface Tier {
  id: number
  name: string
  slug: string
  expansion: Expansion
  background: string
  progress: number
  world: number
  region: number
  realm: number
  summary: string
  total_bosses: number
  normal_bosses_killed: number
  heroic_bosses_killed: number
  mythic_bosses_killed: number
  isFeatured: boolean
  updatedAt: Date
}

export interface RaiderIOState {
  status: string
  tiers: Tier[]
  errors: Error[]
}

export const state = (): RaiderIOState => ({
  status: 'unloaded',
  tiers: [],
  errors: []
})

export const getters: GetterTree<RaiderIOState, RaiderIOState> = {
  tiers(state): Tier[] {
    return state.tiers
  }
}

export const mutations: MutationTree<RaiderIOState> = {
  setStatus(state, { status }): void {
    state.status = status
  },

  addError(state, { error }): void {
    state.status = 'error'
    state.errors.unshift(error)
  },

  popError(state): void {
    state.errors.pop()
  },

  setTiers(state, { tiers }): void {
    state.tiers = tiers
  }
}

export const actions: ActionTree<RaiderIOState, RaiderIOState> = {
  async getRaiderIO({ commit }): Promise<void> {
    commit('setStatus', 'loading')

    try {
      const resp = await this.$axios.$get('http://localhost:3000/raiderIO')
      commit('setStatus', 'success')
      commit('setTiers', resp.data)
    } catch (error) {
      commit('setStatus', 'error')
      commit('addError', error)
    }
  }
}
