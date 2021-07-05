import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'
import { User } from '@/interfaces/entities.interface'
import { useCookies } from '../composables/useCookies'

export const encodeQuery = (queryObject: Record<string, any>): string => {
  return Object.entries(queryObject)
    .filter((tuple) => typeof Object.values(tuple)[0] !== 'undefined')
    .map(([key, value]) => encodeURIComponent(key) + (value != null ? '=' + encodeURIComponent(value) : ''))
    .join('&')
}

export const useAuth = defineStore({
  id: 'auth',
  state: () => ({
    token: null as string | null,
    user: null as User | null,
  }),
  actions: {
    async getMyUser() {
      this.user = await this.$nuxt.$axios.$get('/user/me')
    },
    async login() {
      const cookies = useCookies(this.$nuxt)

      const authorizationEndpoint = 'https://discord.com/api/oauth2/authorize'
      const opts = {
        response_type: 'code',
        client_id: '678486837626404885',
        scope: ['identify'],
        redirect_uri: process.env.REDIRECT_URL,
        state: nanoid(),
        prompt: 'none',
      }

      cookies.set('rbp.state', opts.state)
      cookies.set('rbp.redirect', this.$nuxt.route.path)

      const url = authorizationEndpoint + '?' + encodeQuery(opts)

      window.location.href = url
    },
    async handleCallback() {
      if (this.$nuxt.route.path !== '/callback' || !this.$nuxt.route.query.code) return

      const cookies = useCookies(this.$nuxt)

      const state = cookies.get('rbp.state')
      cookies.remove('rbp.state')

      if (!state || this.$nuxt.route.query.state !== state) return

      try {
        const resp = await this.$nuxt.$axios.$get('/auth/discord/callback', {
          params: { code: this.$nuxt.route.query.code },
          baseURL: process.server ? process.env.BACKEND_SERVER_BASE_URL : process.env.BACKEND_CLIENT_BASE_URL,
        })

        if (resp.token) {
          cookies.set('rbp.token', resp.token)
          this.$nuxt.$axios.setHeader('Authorization', `Bearer ${resp.token}`)
        }

        const redirect = cookies.get('rbp.redirect')
        cookies.remove('rbp.redirect')

        if (redirect) {
          this.$nuxt.redirect(redirect)
        }
      } catch (error) {
        this.user = null
        this.$nuxt.$axios.setHeader('Authorization', false)

        console.error(error)
      }
    },
  },
})
