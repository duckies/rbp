import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { $axios } from '../utils/axios'

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

@Module({ namespaced: true, name: 'raid', stateFactory: true })
export default class RaidModule extends VuexModule {
  public status = 'unloaded'
  public raids: Raid[] = []

  @Mutation
  setStatus(status: string): void {
    this.status = status
  }

  @Mutation
  setRaids(raids: Raid[]): void {
    this.raids = raids
  }

  @Action({ commit: 'setRaids' })
  async getRaids(): Promise<Raid[]> {
    this.context.commit('setStatus', 'loading')

    const resp = await $axios.$get('/raids/featured')

    this.context.commit('setStatus', 'success')
    return resp.result
  }
}
