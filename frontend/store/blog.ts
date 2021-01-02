import { actionTree, mutationTree } from 'nuxt-typed-vuex'
import { Article } from '../interfaces/entities.interface'
import { StateError } from '../interfaces/state/state-error.interface'
import { StateStatus } from '../interfaces/state/state-status.enum'
import { parseAxiosError } from '../utils/state.utils'

export const state = () => ({
  status: StateStatus.UNLOADED,
  error: null as StateError | null,
  articles: [] as Article[],
})

export type BlogState = ReturnType<typeof state>

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
  setArticles(state, articles: Article[]) {
    state.articles = articles
  },
})

export const actions = actionTree(
  { state, mutations },
  {
    async getArticles({ commit }) {
      commit('setStatus', StateStatus.BUSY)

      const [articles] = await this.$axios.$get('/article')

      commit('setArticles', articles)
      commit('setStatus', StateStatus.WAITING)
    },
  }
)
