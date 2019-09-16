import { ActionTree, MutationTree, GetterTree } from 'vuex/types/index'

export interface Channel {
  position: number
  id: string
  name: string
  members: Member[]
}

export interface Game {
  name: string
}

export interface Member {
  username: string
  status: string
  mute?: boolean
  suppress?: boolean
  deaf?: boolean
  channel_id?: string
  nick?: string
  game?: Game
  avatar_url: string
  avatar: string
  self_deaf?: boolean
  discriminator: string
  self_mute?: boolean
  id: string
}

export interface Discord {
  channels: Channel[]
  instant_invite: string
  id: string
  members: Member[]
  name: string
}

export interface DiscordState {
  status: string
  errors: Error[]
  discord: Discord | undefined
}

export const state = (): DiscordState => ({
  status: 'unloaded',
  errors: [],
  discord: undefined
})

export const getters: GetterTree<DiscordState, DiscordState> = {
  discord(state: DiscordState): Discord | undefined {
    return state.discord
  },
  channels(state: DiscordState): Channel[] | undefined {
    return state.discord ? state.discord.channels : undefined
  }
}

export const mutations: MutationTree<DiscordState> = {
  setStatus(state: DiscordState, status: string): void {
    state.status = status
  },
  addError(state: DiscordState, error: Error): void {
    state.errors.unshift(error)
  },
  popError(state: DiscordState): void {
    state.errors.pop()
  },
  setDiscord(state: DiscordState, discord: Discord): void {
    state.discord = discord

    state.discord.channels.sort(
      (a: Channel, b: Channel) => a.position - b.position
    )

    state.discord.members.forEach((m: Member) => {
      if (m.channel_id && state.discord) {
        const channel = state.discord.channels.find(
          (c: Channel) => c.id === m.channel_id
        )

        if (channel) {
          if (!channel.members) {
            channel.members = [m]
          } else {
            channel.members.push(m)
          }
        }
      }
    })
  }
}

export const actions: ActionTree<DiscordState, DiscordState> = {
  async getDiscord({ commit }): Promise<void> {
    commit('setStatus', 'loading')

    try {
      const resp = await this.$axios.$get(
        'https://discordapp.com/api/servers/142372929961721856/embed.json'
      )

      commit('setStatus', 'success')
      commit('setDiscord', resp)
    } catch (error) {
      commit('setStatus', 'error')
      commit('addError', error)
    }
  }
}
