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
  discord_id: string
  discord_avatar?: string
  discord_username: string
  roles: string[] // Replace with role enum.
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
  // knownCharacters?:
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
  'Player Alt'
]

@Module({ namespaced: true, name: 'auth', stateFactory: true })
export default class AuthModule extends VuexModule {
  public status = 'unloaded'
  public user: User | null = null

  get loggedIn(): boolean {
    return !!this.user && Object.keys(this.user).length > 0
  }

  get isOfficer(): boolean {
    return !!(this.user?.roles?.includes('Guild Master') || this.user?.roles?.includes('Officer'))
  }

  get avatars(): Avatars | undefined {
    if (!this.user || !this.user.discord_avatar) {
      return undefined
    }

    const base = `https://cdn.discordapp.com/avatars/${this.user.discord_id}/${this.user.discord_avatar}`

    const avatars: Avatars = {
      webp: `${base}.webp`,
      png: `${base}.png`,
      jpg: `${base}.jpg`
    }

    if (this.user.discord_avatar.startsWith('a_')) {
      avatars.gif = `${base}.gif`
    }

    return avatars
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
