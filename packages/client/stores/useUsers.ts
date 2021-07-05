import { defineStore } from 'pinia'

export const useUsers = defineStore({
  id: 'users',
  state: () => ({}),
  actions: {
    async getMyUser() {
      return this.$nuxt.$axios.$get('/user/me')
    },
  },
})
