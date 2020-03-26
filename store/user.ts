import { GetterTree, MutationTree, ActionTree } from 'vuex'
import { RootState } from '~/store'

export interface User {
  id: number
  displayname?: string
  avatar?: string
  customAvatar: boolean
  battletag: string
  blizzardid: number
  blizzardtoken?: string
  blizzardTokenExpiration?: Date
  discord_id: string
  discord_avatar?: string
  discord_username: string
  discord_discriminator: string
  roles: string[]
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
}

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

export const state = () => ({
  status: 'unloaded',
  user: null as User | null,
  token: null as string | null,
})

export type UserState = ReturnType<typeof state>

export const getters: GetterTree<UserState, RootState> = {
  isLoggedIn: (state) => state.user != null,
  isOfficer: (state) => !!(state?.user?.roles.includes('Rank0') || state?.user?.roles.includes('Rank1')),
  avatar: (state) => {
    if (state?.user?.discord_avatar) {
      return `https://cdn.discordapp.com/avatars/${state.user.discord_id}/${state.user.discord_avatar}${
        state.user.discord_avatar.includes('a_') ? '.gif' : '.png'
      }`
    }
  },
  tag: (state) => (state.user == null ? null : `${state.user.discord_username}#${state.user.discord_discriminator}`),
}

export const mutations: MutationTree<UserState> = {
  setStatus(state, status: string) {
    state.status = status
  },
  setUser(state, user: User | null) {
    state.user = user ? Object.assign({}, user) : null
  },
  setToken(state, token: string | null) {
    state.token = token
  },
}

export const actions: ActionTree<UserState, RootState> = {
  logout({ commit }) {
    commit('setUser', null)
    commit('setToken', null)
    this.$cookies.remove('rbp.token')
  },
  async getProfile({ commit }) {
    try {
      commit('setStatus', 'loading')

      const resp = await this.app.$axios.$get('/user/me')

      commit('setStatus', 'success')
      commit('setUser', resp)
    } catch (error) {
      commit('setStatus', 'error')
      console.error(error)
    }
  },
}
