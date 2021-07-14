import { Post } from '@/interfaces/entities.interface'
import { defineStore } from 'pinia'

export const useBlog = defineStore({
  id: 'blog',
  state: () => ({
    posts: [] as Post[],
  }),
  actions: {
    async getPosts() {
      const [posts] = await this.$nuxt.$axios.$get('/post')

      this.posts = posts
    },
  },
})
