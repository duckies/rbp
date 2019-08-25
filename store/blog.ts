import { ActionTree, GetterTree, MutationTree } from 'vuex/types/index'
import { AxiosResponse } from 'axios'
import { User } from './auth'

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

export interface BlogState {
  status: string
  errors: Error[]
  articles: Article[]
  total: number
}

export const state = (): BlogState => ({
  status: 'unloaded',
  errors: [],
  articles: [],
  total: 0
})

export const getters: GetterTree<BlogState, BlogState> = {
  articles(state: BlogState): Article[] {
    return state.articles
  },
  total(state: BlogState): number {
    return state.total
  }
}

export const mutations: MutationTree<BlogState> = {
  setStatus(state: BlogState, status: string): void {
    state.status = status
  },
  addError(state: BlogState, error: Error): void {
    state.errors.unshift(error)
  },
  popError(state: BlogState): void {
    state.errors.pop()
  },
  setArticles(state: BlogState, articles: Article[]): void {
    state.articles = articles
  },
  setTotal(state: BlogState, total: number): void {
    state.total = total
  }
}

export const actions: ActionTree<BlogState, BlogState> = {
  async getArticles({ commit }): Promise<void> {
    commit('setStatus', 'loading')

    try {
      const resp = await this.$axios.$get('/article')
      commit('setStatus', 'success')
      commit('setTotal', resp.total)
      commit('setArticles', resp.result)
    } catch (error) {
      commit('setStatus', 'error')
      commit('addError', error)
    }
  }
}
