import { defineStore } from 'pinia'
import { FindCharacterDto } from '@server/blizzard/dto/find-character.dto'
import { GuildCharacter } from '@/interfaces/entities.interface'

export const useRoster = defineStore({
  id: 'roster',
  state: () => ({
    roster: [] as GuildCharacter[],
  }),
  actions: {
    async getRoster() {
      const [characters] = await this.$nuxt.$axios.$get('/characters/roster')

      this.roster = characters
    },
    getCharacterData({ name, realm, region }: FindCharacterDto) {
      return this.$nuxt.$axios.$get(
        `/form-character/${region}/${realm}/${name}`
      )
    },
  },
})
