import { ActionTree, MutationTree } from 'vuex'
import { RootState } from '.'

export interface Slide {
  id: number
  image: string
  title: string
  subtitle?: string
  link?: string
}

export const state = () => ({
  status: 'unloaded',
  slides: [] as Slide[],
})

type SlideState = ReturnType<typeof state>

export const mutations: MutationTree<SlideState> = {
  setStatus(state: SlideState, status: string) {
    state.status = status
  },
  setSlides(state: SlideState, slides: Slide[]) {
    state.slides = slides
  },
}

export const actions: ActionTree<SlideState, RootState> = {
  async getSlides({ commit }) {
    commit('setStatus', 'loading')

    const resp = await this.$axios.$get('/slide')

    commit('setSlides', resp)
  },
}
