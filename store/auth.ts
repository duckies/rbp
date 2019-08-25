import { GetterTree, MutationTree, ActionTree } from 'vuex/types/index'
import { resetAuthToken } from '../utils/auth'
import { Article } from './blog'

export enum Roles {
  GuildMaster = 'Guild Master',
  Technician = 'Technician',
  Officer = 'Officer',
  Raider = 'Raider',
  Trial = 'Trial',
  Fan = 'Fan',
  Guest = 'Guest'
}

export const Ranks = [
  'Guild Master',
  'Officer',
  'Officer Alt',
  'Raider (Bank)',
  'Raider',
  'Recruit',
  'Fan',
  'Player Alt'
]

export interface User {
  id: number
  displayName: string
  avatar: string
  customAvatar: boolean
  battletag: string
  blizzardid?: number
  blizzardtoken?: string
  roles: Roles[]
  createdAt: Date
  updatedAt: Date
  justCreated?: boolean
  articles?: Article[]
  // comments?: Comment[]
  // mainCharacter?: Character
  // characters?: Character[]
}

export interface AuthState {
  status: string
  errors: Error[]
  user?: User
}

export const state = (): AuthState => ({
  status: 'unloaded',
  errors: [],
  user: undefined
})

export const getters: GetterTree<AuthState, AuthState> = {
  user(state: AuthState): User | undefined {
    return state.user
  },
  isAuthenticated(state: AuthState): boolean {
    return !!state.user
  }
}

export const mutations: MutationTree<AuthState> = {
  setStatus(state: AuthState, status: string): void {
    state.status = status
  },
  addError(state: AuthState, error: Error): void {
    state.errors.unshift(error)
  },
  popError(state: AuthState): void {
    state.errors.pop()
  },
  setUser(state: AuthState, user: User): void {
    state.user = user
  },
  clearUser(state: AuthState): void {
    resetAuthToken()
    state.user = undefined
  }
}

export const actions: ActionTree<AuthState, AuthState> = {
  async getMe({ commit }): Promise<void> {
    commit('setStatus', 'loading')

    try {
      const resp = await this.$axios.$get('/user/me')

      commit('setStatus', 'success')
      commit('setUser', resp)
    } catch (error) {
      commit('setStatus', 'error')
      commit('addError', error)
    }
  },
  logout({ commit }): void {
    commit('clearUser')
  }
}
