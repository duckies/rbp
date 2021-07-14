import { defineStore } from 'pinia'
import { CreateRaidIdentityDto } from '@server/raid-identity/dto/create-raid-identity.dto'
import { RaidRole } from '../../../server/src/raid-identity/enums/raid-role.enum'
import { RaidIdentity, RaidNight } from '../interfaces/entities.interface'

export const useAttendance = defineStore({
  id: 'attendance',
  state: () => ({
    identity: null as RaidIdentity | null,
    identities: [] as RaidIdentity[],
    nights: [] as RaidNight[],
  }),
  actions: {
    async createIdentity(createRaidIdentityDto: CreateRaidIdentityDto) {
      this.identity = await this.$nuxt.$axios.$post(
        '/raid-identity',
        createRaidIdentityDto
      )
    },
    async findAllIdentities() {
      const [identities] = await this.$nuxt.$axios.$get('/raid-identity')

      this.identities = identities
    },
    async findAllNights() {
      const [nights] = await this.$nuxt.$axios.$get('/raid-night')

      this.nights = nights
    },
    getImageFromRole(role: RaidRole) {
      return this.$nuxt.$img(
        `/images/attendance/roles/${role.toLowerCase()}.jpg`
      )
    },
  },
})
