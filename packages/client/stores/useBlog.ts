import { defineStore } from 'pinia';
import { Article } from '@/interfaces/entities.interface'

export const useBlog = defineStore({
  id: 'blog',
  state: () => ({
    articles: [] as Article[]
  }),
  actions: {
    async getPosts() {
      const [articles] = await this.$nuxt.$axios.$get('/article')

      this.articles = articles
    }
  }
})