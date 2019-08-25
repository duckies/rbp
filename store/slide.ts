import { GetterTree, MutationTree, ActionTree } from 'vuex/types/index'

export interface Slide {
  id: number
  image: string
  title: string
  subtitle?: string
  link?: string
}

export interface SlideState {
  status: string
  errors: Error[]
  slides: Slide[]
}

export const state = (): SlideState => ({
  status: 'unloaded',
  errors: [],
  slides: []
})

export const getters: GetterTree<SlideState, SlideState> = {
  slides(state): Slide[] {
    return state.slides
  }
}

export const mutations: MutationTree<SlideState> = {
  setStatus(state, status): void {
    state.status = status
  },

  addError(state, error): void {
    state.errors.unshift(error)
  },

  popError(state): void {
    state.errors.pop()
  },

  setSlides(state, slides): void {
    state.slides = slides
  }
}

export const actions: ActionTree<SlideState, SlideState> = {
  async getSlides({ commit }): Promise<void> {
    commit('setStatus', 'loading')

    try {
      const resp = await this.$axios.$get('/slide')
      commit('setStatus', 'success')
      commit('setSlides', resp.result)
    } catch (error) {
      commit('setStatus', 'error')
      commit('addError', error)
    }
  }
}
