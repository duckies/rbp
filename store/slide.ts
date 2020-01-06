import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { $axios } from '../utils/axios'

export interface Slide {
  id: number
  image: string
  title: string
  subtitle?: string
  link?: string
}

@Module({ namespaced: true, name: 'slide', stateFactory: true })
export default class SlideModule extends VuexModule {
  public status = 'unloaded'
  public slides: Slide[] = []

  @Mutation
  setStatus(status: string): void {
    this.status = status
  }

  @Mutation
  setSlides(slides: Slide[]): void {
    this.slides = slides
  }

  @Action({ commit: 'setSlides' })
  async getSlides(): Promise<Slide[]> {
    this.context.commit('setStatus', 'loading')

    const resp = await $axios.$get('/slide')

    this.context.commit('setStatus', 'success')
    return resp
  }
}
