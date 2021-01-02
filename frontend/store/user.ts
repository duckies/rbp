import { actionTree, mutationTree } from 'nuxt-typed-vuex'
import { Roles } from '../../backend/src/app.roles'
import { User } from '../interfaces/entities.interface'
import { StateError } from '../interfaces/state/state-error.interface'
import { StateStatus } from '../interfaces/state/state-status.enum'
import { parseAxiosError } from '../utils/state.utils'

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
  status: StateStatus.UNLOADED,
  error: null as StateError | null,
  user: null as User | null,
  token: null as string | null,
})

export type UserState = ReturnType<typeof state>

export const getters = {
  isLoggedIn: (state: UserState) => state.user != null,
  isOfficer: (state: UserState) =>
    !!(state?.user?.roles.includes(Roles.GuildMaster) || state?.user?.roles.includes(Roles.Officer)),
  avatar: (state: UserState) => {
    if (state?.user?.discord_avatar) {
      return `https://cdn.discordapp.com/avatars/${state.user.discord_id}/${state.user.discord_avatar}${
        state.user.discord_avatar.includes('a_') ? '.gif' : '.png'
      }`
    }
  },
  tag: (state: UserState) =>
    state.user == null ? null : `${state.user.discord_username}#${state.user.discord_discriminator}`,
}

export const mutations = mutationTree(state, {
  setStatus(state, status: StateStatus) {
    state.status = status

    if (status === StateStatus.BUSY) {
      state.error = null
    }
  },
  setError(state, error: any) {
    state.status = StateStatus.ERROR
    state.error = parseAxiosError(error)
  },
  setUser(state, user: User | null) {
    state.user = user ? Object.assign({}, user) : null
  },
  setToken(state, token: string | null) {
    state.token = token
  },
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    logout({ commit }): void {
      commit('setUser', null)
      commit('setToken', null)
      this.$cookies.remove('rbp.token')
    },
    async getProfile({ commit }): Promise<void> {
      try {
        commit('setStatus', StateStatus.BUSY)

        const resp = await this.$axios.$get('/user/me')

        commit('setStatus', StateStatus.WAITING)
        commit('setUser', resp)
      } catch (error) {
        commit('setError', error)
      }
    },
  }
)
