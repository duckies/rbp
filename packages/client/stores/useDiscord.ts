import { defineStore } from 'pinia';
import { Channel, Discord } from '@/types/discord/discord.interface';

export const useDiscord = defineStore({
  id: 'discord',
  state: () => ({
    online: 0,
    channels: [] as Channel[]
  }),
  actions: {
    async getDiscord() {
      const discord = await this.$nuxt.$axios.$get<Discord>('https://discord.com/api/servers/142372929961721856/embed.json')

      // Order channels by their position within the server.
      this.channels = discord.channels.sort((a, b) => a.position - b.position)

      discord.members.forEach((member) => {
        if (member.channel_id) {
          const channel = this.channels.find((c) => c.id === member.channel_id)

          if (!channel) return;

          if (channel.members) {
            channel.members.push(member)
          } else {
            channel.members = [member]
          }
        }
      })


      this.online = discord.members.filter((member) => member.status === 'online').length
    }
  }
})