<template>
  <v-card :loading="loading" class="mb-4" img="/images/artwork/undead_glue.jpg">
    <v-card-title>Select your characters</v-card-title>

    <v-card-text>
      Select your main character and any alts you wish to include with your application.
      <span v-if="isTokenInvalid">
        <a @click="reauthenticate">Reauthenticate</a> with Blizzard if your information has changed and your characters
        aren't listed
      </span>

      <template v-if="!manual">
        <v-row>
          <v-col sm="12" md="6">
            <v-select
              v-model="mainCharacter"
              label="Main Character"
              hint="Pick your current main character or character you plan to raid with."
              persistent-hint
              :items="knownCharacters"
              item-text="name"
              return-object
              outlined
              chips
            >
              <template v-slot:item="{ item }">
                <!-- <v-avatar class="mr-3 mb-2">
                  <v-img :src="avatarFromCharacter(item)" />
                </v-avatar> -->

                <span :class="`class-color-${item.class} mr-2`">{{ item.name }}</span>
                <span>{{ item.realm }} - {{ item.level }}</span>
              </template>
            </v-select>
          </v-col>

          <v-col sm="12" md="6">
            <v-row>
              <v-select
                v-model="altCharacters"
                label="Optional Alts"
                hint="Optionally select any alts you wish for us to see."
                persistent-hint
                :items="potentialAlts"
                item-text="name"
                return-object
                multiple
                outlined
                :disabled="!isMainSelected"
                chips
              >
                <template v-slot:item="{ item }">
                  <!-- <v-avatar class="mr-3 mb-2">
                    <v-img :src="avatarFromCharacter(item)" />
                  </v-avatar> -->

                  <span :class="`class-color-${item.class} mr-2`">
                    {{ item.name }}
                  </span>
                  <span>{{ item.realm }} - {{ item.level }}</span>
                </template>
              </v-select>
            </v-row>
          </v-col>
        </v-row>

        If you encounter an issue you may
        <a @click="manual = !manual">manually enter your characters</a>.
      </template>

      <template v-else>
        <v-row>
          <v-col sm="12" md="5">
            <v-text-field label="Character Name" outlined></v-text-field>
          </v-col>
          <v-col sm="8" md="5">
            <v-select label="Character Realm" :items="realms" outlined></v-select>
          </v-col>
          <v-col sm="4" md="2">
            <v-btn large outlined @click="manualAddCharacter">Add Character</v-btn>
          </v-col>
        </v-row>

        If you made a mistake, you may switch back to
        <a @click="manual = !manual">automatic mode</a>.
      </template>
    </v-card-text>

    <v-card-actions class="action-shadow">
      <span v-if="knownCharacters && knownCharacters.length">
        Characters last downloaded {{ relativeCharacterLastUpdated }}.
      </span>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { AxiosError } from 'axios'
import { formatRelative } from 'date-fns'
import { Watch } from 'vue-property-decorator'
import { RaiderIOCharacter } from '@/store/raiderIO'
import { Character, KnownCharacter } from '@/store/character'
import Realms from '@/interfaces/realms'
import { characterStore } from '@/store'

@Component
export default class CharacterSelection extends Vue {
  // Auth Store
  isTokenInvalid!: boolean
  // Character Store
  characterError?: AxiosError
  characters?: Character[]
  knownCharactersLastUpdated?: Date
  knownCharacterDataStale?: boolean
  // Class data
  mainCharacter: null | KnownCharacter = null
  mainCharacterData?: KnownCharacter
  altCharacters: KnownCharacter[] = []
  altCharactersData: KnownCharacter[] = []
  // Component State
  manual = false
  realms: string[] = Realms.sort()

  get loading(): boolean {
    return characterStore.isLoading
  }

  @Watch('mainCharacter')
  async onMainChanged(character: KnownCharacter): Promise<void> {
    const [blizzard, raiderIO] = await this.getCharacterData(character.name, character.realm, character.region)

    this.$store.commit('character/setMainCharacter', Object.assign({}, this.mainCharacter, { blizzard, raiderIO }))
  }

  @Watch('altCharacters')
  async onAltChanged(alts: KnownCharacter[]): Promise<void> {
    for (const character in alts) {
      if (
        !Object.prototype.hasOwnProperty.call(alts[character], 'blizzard') ||
        !Object.prototype.hasOwnProperty.call(alts[character], 'raiderIO')
      ) {
        const [blizzard, raiderIO] = await this.getCharacterData(
          alts[character].name,
          alts[character].realm,
          alts[character].region
        )

        alts[character] = Object.assign(alts[character], { blizzard, raiderIO })
      }
    }

    this.$store.commit('character/setAltCharacters', alts)
  }

  get knownCharacters(): KnownCharacter[] {
    return characterStore.knownCharacters
  }

  get isMainSelected(): boolean {
    if (!this.mainCharacter) return false

    return Object.entries(this.mainCharacter).length !== 0
  }

  get isCharacterDataAvailable(): boolean {
    if (!this.mainCharacter || !this.mainCharacterData) return false
    if (!Object.prototype.hasOwnProperty.call(this.mainCharacterData, 'blizzard')) return false
    if (typeof this.mainCharacterData.blizzard === 'undefined') return false
    return Object.entries(this.mainCharacterData.blizzard).length !== 0
  }

  get potentialAlts(): KnownCharacter[] {
    if (!this.mainCharacter || !this.knownCharacters) return []

    return this.knownCharacters.filter(c => c !== this.mainCharacter)
  }

  get relativeCharacterLastUpdated(): string {
    if (!this.knownCharactersLastUpdated) return 'never'

    return formatRelative(this.knownCharactersLastUpdated, new Date())
  }

  manualAddCharacter(): void {
    console.log('Thats nice')
  }

  async getCharacters(): Promise<void> {
    await this.$store.dispatch('character/getUserCharactersFromBlizzard')
  }

  reauthenticate(): void {
    window.location.href = 'http://localhost:3000/auth/blizzard/login'
  }

  getCharacterData(name: string, realm: string, region: string): Promise<[Character, RaiderIOCharacter]> {
    return Promise.all([
      this.$store.dispatch('character/getAppCharacter', {
        name,
        realm,
        region
      }) as Promise<Character>,
      this.$store.dispatch('raiderIO/getCharacterRaiderIO', {
        name,
        realm,
        region
      }) as Promise<RaiderIOCharacter>
    ])
  }
}
</script>

<style lang="scss" scoped>
.action-shadow {
  background: rgba(20, 21, 23, 0.55);
  font-family: 'Roboto Mono', sans-serif;
  font-size: 14px;
}
</style>
