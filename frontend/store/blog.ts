import { ActionTree, MutationTree } from 'vuex'
import { RootState } from '~/store'
import { User } from '~/store/user'

export interface Article {
  id: number
  title: string
  slug: string
  subtitle: string
  content: string
  header: string
  author: User
  createdAt: Date
  updatedAt: Date
}

export const state = () => ({
  status: 'unloaded',
  articles: [] as Article[],
})

export type BlogState = ReturnType<typeof state>

export const mutations: MutationTree<BlogState> = {
  setStatus(state, status: string) {
    state.status = status
  },
  setArticles(state, articles: Article[]) {
    state.articles = articles
  },
}

export const actions: ActionTree<BlogState, RootState> = {
  async getArticles({ commit }) {
    commit('setStatus', 'loading')

    const resp = await this.$axios.$get('/article')

    commit('setStatus', 'success')
    commit('setArticles', resp[0])
  },
}
