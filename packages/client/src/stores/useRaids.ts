import { defineStore } from 'pinia'
import { Raid } from '@/interfaces/entities.interface'

export const useRaids = defineStore({
  id: 'raids',
  state: () => ({
    raids: [] as Raid[],
  }),
  actions: {
    async findFeatured() {
      const [raids] = await this.$nuxt.$axios.$get<[Raid[], number]>(
        '/raids/featured'
      )

      this.raids = raids
    },
  },
})
