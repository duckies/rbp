import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'
import { User } from '@/interfaces/entities.interface'
import { Roles } from '@server/app.roles'
import { useCookies } from '../composables/useCookies'

export interface Avatars {
  gif?: string
  webp: string
  jpg: string
  png: string
}

export const Ranks: string[] = [
  'Guild Master',
  'Officer',
  'Officer Alt',
  'Raider (Bank)',
  'Raider',
  'Recruit',
  'Fan',
  'Player Alt',
]

export const encodeQuery = (queryObject: Record<string, any>): string => {
  return Object.entries(queryObject)
    .filter((tuple) => typeof Object.values(tuple)[0] !== 'undefined')
    .map(
      ([key, value]) =>
        encodeURIComponent(key) +
        (value != null ? '=' + encodeURIComponent(value) : '')
    )
    .join('&')
}

export const useAuth = defineStore({
  id: 'auth',
  state: () => ({
    token: null as string | null,
    user: null as User | null,
  }),
  getters: {
    isLoggedIn: (state) => state.user !== null,
    isOfficer: (state) =>
      !!(
        state?.user?.roles.includes(Roles.GuildMaster) ||
        state?.user?.roles.includes(Roles.Officer)
      ),
    tag: (state) =>
      state.user
        ? `${state.user.discord_username}#${state.user.discord_discriminator}`
        : null,
    avatar: (state) => {
      if (state?.user?.discord_avatar) {
        return `https://cdn.discordapp.com/avatars/${state.user.discord_id}/${
          state.user.discord_avatar
        }${state.user.discord_avatar.includes('a_') ? '.gif' : '.png'}`
      }

      return null
    },
  },
  actions: {
    async getMyUser() {
      this.user = await this.$nuxt.$axios.$get('/user/me')
    },
    login() {
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
    logout() {
      const cookies = useCookies(this.$nuxt)

      cookies.remove('rbp.state')
      cookies.remove('rbp.redirect')
      cookies.remove('rbp.token')

      this.token = null
      this.user = null
    },
    async handleCallback() {
      if (this.$nuxt.route.path !== '/callback' || !this.$nuxt.route.query.code)
        return

      const cookies = useCookies(this.$nuxt)

      const state = cookies.pop('rbp.state')

      if (!state || this.$nuxt.route.query.state !== state) return

      try {
        const resp = await this.$nuxt.$axios.$get('/auth/discord/callback', {
          params: { code: this.$nuxt.route.query.code },
          baseURL: process.server
            ? process.env.BACKEND_SERVER_BASE_URL
            : process.env.BACKEND_CLIENT_BASE_URL,
        })

        if (resp.token) {
          cookies.set('rbp.token', resp.token)
          this.$nuxt.$axios.setHeader('Authorization', `Bearer ${resp.token}`)
        }

        const redirect = cookies.pop('rbp.redirect')

        this.$nuxt.redirect(redirect || '/')
      } catch (error) {
        this.user = null
        this.$nuxt.$axios.setHeader('Authorization', false)

        // console.error(error)
      }
    },
  },
})
