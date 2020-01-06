import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $axios } from '../utils/axios'

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

@Module({ namespaced: true, name: 'discord', stateFactory: true })
export default class DiscordModule extends VuexModule {
  status = 'unloaded'
  discord?: Discord = undefined

  get channels(): Channel[] {
    return this.discord ? this.discord.channels : []
  }

  @Mutation
  setStatus(status: string): void {
    this.status = status
  }

  @Mutation
  setDiscord(discord: Discord): void {
    this.discord = discord

    // Order channels by their real positons.
    this.discord.channels.sort((a, b) => a.position - b.position)

    this.discord.members.forEach(m => {
      if (m.channel_id && this.discord) {
        const channel = this.discord.channels.find(c => c.id === m.channel_id)

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

  @Action({ commit: 'setDiscord' })
  getDiscord(): Promise<Discord> {
    this.context.commit('setStatus', 'loading')

    return $axios.$get('https://discordapp.com/api/servers/142372929961721856/embed.json')
  }
}
