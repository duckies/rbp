import { GetterTree, MutationTree, ActionTree } from 'vuex/types/index'
import { AxiosResponse } from 'axios'

export interface Raid {
  id: number
  name: string
  slug: string
  expansion: string
  background: string
  progress: number
  difficulty: number
  world: number
  region: number
  realm: number
  summary: string
  total_bosses: number
  normal_bosses_killed: number
  heroic_bosses_killed: number
  mythic_bosses_killed: number
  isFeatured: true
  updatedAt: Date
}

export interface RaidResponse {
  result: Raid[]
  total: number
}

export interface RaidState {
  status: string
  raids: Raid[]
  errors: Error[]
}

export const state = (): RaidState => ({
  status: 'unloaded',
  errors: [],
  raids: []
})

export const getters: GetterTree<RaidState, RaidState> = {
  raids(state: RaidState): Raid[] {
    return state.raids
  }
}

export const mutations: MutationTree<RaidState> = {
  setStatus(state: RaidState, status: string): void {
    state.status = status
  },
  addError(state: RaidState, error: Error): void {
    state.errors.unshift(error)
  },
  popError(state: RaidState): void {
    state.errors.pop()
  },
  setRaids(state: RaidState, raids: Raid[]): void {
    state.raids = raids
  }
}

export const actions: ActionTree<RaidState, RaidState> = {
  async getFeaturedRaids({ commit }): Promise<void> {
    commit('setStatus', 'loading')

    try {
      const resp = await this.$axios.$get('http://localhost:3000/raid/featured')
      commit('setStatus', 'success')
      commit('setRaids', resp.result)
    } catch (error) {
      commit('setStatus', 'error')
      commit('addError', error)
    }
  }
}
