import { defineStore } from 'pinia'
import { Slide } from '@/interfaces/entities.interface'

export const useSlides = defineStore({
  id: 'slides',
  state: () => ({
    slides: [] as Slide[],
  }),
  actions: {
    async findAll() {
      const [slides] = await this.$nuxt.$axios.$get<[Slide[], number]>('/slide')

      this.slides = slides
    },
  },
})
