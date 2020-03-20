import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { $axios } from '../utils/axios'
import { User } from './user'

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

@Module({ namespaced: true, name: 'blog', stateFactory: true })
export default class BlogModule extends VuexModule {
  public status = 'unloaded'
  public articles: Article[] = []

  @Mutation
  setStatus(status: string): void {
    this.status = status
  }

  @Mutation
  setArticles(articles: Article[]): void {
    this.articles = articles
  }

  @Action({ commit: 'setArticles', rawError: true })
  async getArticles(): Promise<Article[]> {
    this.context.commit('setStatus', 'loading')

    const resp = await $axios.$get('/article')

    return resp.result
  }
}
