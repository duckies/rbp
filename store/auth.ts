import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { $axios } from '../utils/axios'

export interface User {
  id: number
  displayname?: string
  avatar?: string
  customAvatar: boolean
  battletag: string
  blizzardid: number
  blizzardtoken?: string
  blizzardTokenExpiration?: Date
  roles: string[] // Replace with role enum.
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
  // knownCharacters?:
}

export const Ranks: string[] = [
  'Guild Master',
  'Officer',
  'Officer Alt',
  'Raider (Bank)',
  'Raider',
  'Recruit',
  'Fan',
  'Player Alt'
]

@Module({ namespaced: true, name: 'auth', stateFactory: true })
export default class AuthModule extends VuexModule {
  public status = 'unloaded'
  public user?: User = undefined

  get usr(): User | undefined {
    return this.user
  }

  get loggedIn(): boolean {
    return !!this.user && Object.keys(this.user).length > 0
  }

  @Mutation
  setStatus(status: string): void {
    this.status = status
  }

  @Mutation
  setUser(user: User): void {
    this.user = Object.assign({}, user)
  }

  @Mutation
  clearUser(): void {
    this.user = Object.assign({})
  }

  @Action({ commit: 'setUser', rawError: true })
  async fetchUser(): Promise<User> {
    this.context.commit('setStatus', 'loading')

    const resp = await $axios.$get('/user/me')

    this.context.commit('setStatus', 'success')
    return resp
  }
}
