import { actionTree, mutationTree } from 'nuxt-typed-vuex'
import { Raid } from '../../backend/src/raid/raid.entity'
import { StateError } from '../interfaces/state/state-error.interface'
import { StateStatus } from '../interfaces/state/state-status.enum'
import { parseAxiosError } from '../utils/state.utils'

export const state = () => ({
  status: StateStatus.UNLOADED,
  error: null as StateError | null,
  raids: [] as Raid[],
})

export type RaidState = ReturnType<typeof state>

export const getters = {
  rankings: (state: RaidState) =>
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

export const mutations = mutationTree(state, {
  setStatus(state, status: StateStatus) {
    state.status = status

    if (status === StateStatus.BUSY) {
      state.error = null
    }
  },
  setError(state, error: any) {
    state.status = StateStatus.ERROR
    state.error = parseAxiosError(error)
  },
  setRaids(state, raids: Raid[]) {
    state.raids = raids
  },
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async getRaids({ commit }): Promise<void> {
      commit('setStatus', StateStatus.BUSY)

      const resp = await this.$axios.$get('/raids/featured')

      commit('setStatus', StateStatus.WAITING)
      commit('setRaids', resp.result)
    },
  }
)
