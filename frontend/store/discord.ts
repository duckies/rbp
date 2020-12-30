import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { RootState } from '.'

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

export const state = () => ({
  discord: null as Discord | null,
})

export type DiscordState = ReturnType<typeof state>

export const getters: GetterTree<DiscordState, RootState> = {
  channels: (state) => state?.discord?.channels || [],
  online: (state) =>
    state?.discord?.members.length ? state.discord.members.filter((m) => m.status === 'online').length : 0,
}

export const mutations: MutationTree<DiscordState> = {
  setDiscord(state, discord: Discord) {
    state.discord = discord

    // Order channels by their real positons.
    state.discord.channels.sort((a, b) => a.position - b.position)

    state.discord.members.forEach((m) => {
      if (m.channel_id && state.discord) {
        const channel = state.discord.channels.find((c) => c.id === m.channel_id)

        if (channel) {
          if (!channel.members) {
            channel.members = [m]
          } else {
            channel.members.push(m)
          }
        }
      }
    })
  },
}

export const actions: ActionTree<DiscordState, RootState> = {
  async getDiscord({ commit }) {
    const resp = await this.$axios.$get('https://discord.com/api/servers/142372929961721856/embed.json')

    commit('setDiscord', resp)
  },
}
