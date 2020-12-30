import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { RootState } from '.'

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

export const state = () => ({
  status: 'unloaded',
  raids: [] as Raid[],
})

export type RaidState = ReturnType<typeof state>

export const getters: GetterTree<RaidState, RootState> = {
  rankings: (state) =>
    state.raids.length
      ? [
          {
            rank: state.raids[0].world,
            title: 'World',
            background: require('@/assets/images/sidebar/azeroth.jpg'),
          },
          {
            rank: state.raids[0].region,
            title: 'Region',
            background: require('@/assets/images/sidebar/barrens.jpg'),
          },
          {
            rank: state.raids[0].realm,
            title: 'Realm',
            background: require('@/assets/images/sidebar/area-52.jpg'),
          },
        ]
      : [],
}

export const mutations: MutationTree<RaidState> = {
  setStatus(state, status: string) {
    state.status = status
  },
  setRaids(state, raids: Raid[]) {
    state.raids = raids
  },
}

export const actions: ActionTree<RaidState, RootState> = {
  async getRaids({ commit }) {
    commit('setStatus', 'loading')

    const resp = await this.$axios.$get('/raids/featured')

    commit('setStatus', 'success')
    commit('setRaids', resp.result)
  },
}
