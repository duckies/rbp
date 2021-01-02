import { actionTree, mutationTree } from 'nuxt-typed-vuex'
import { Slide } from '../interfaces/entities.interface'
import { StateError } from '../interfaces/state/state-error.interface'
import { StateStatus } from '../interfaces/state/state-status.enum'
import { parseAxiosError } from '../utils/state.utils'

export const state = () => ({
  status: StateStatus.UNLOADED,
  error: null as StateError | null,
  slides: [] as Slide[],
})

type SlideState = ReturnType<typeof state>

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
  setSlides(state: SlideState, slides: Slide[]) {
    state.slides = slides
  },
})

export const actions = actionTree(
  { state, mutations },
  {
    async getSlides({ commit }): Promise<void> {
      commit('setStatus', StateStatus.BUSY)

      const resp = await this.$axios.$get('/slide')

      commit('setSlides', resp)
      commit('setStatus', StateStatus.WAITING)
    },
  }
)
