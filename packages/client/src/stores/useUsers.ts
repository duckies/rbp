import { defineStore } from 'pinia'

export const useUsers = defineStore({
  id: 'users',
  state: () => ({}),
  actions: {
    getMyUser() {
      return this.$nuxt.$axios.$get('/user/me')
    },
  },
})
