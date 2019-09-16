<template>
  <div>
    <hero :background="background" :title="title" :caption="caption" />

    <v-container class="hero-nudge">
      <v-row>
        <v-col>
          <v-card class="mb-5">
            <v-card-title>Application Process</v-card-title>
            <v-card-text>
              Thoroughly read our
              <nuxt-link to="/about">about us</nuxt-link> page to learn more
              about how our guild operates before applying. Our current
              recruitment goals are posted where we advertise, but anyone who
              thinks they have the skill or determination to raid with us should
              apply. We only ask that you fill out our application completely or
              it will reflect poorly on your desire to join us.<br /><br />Once
              an application is submitted, the guild and officers will be
              notified so comments can be made between both parties on the
              application. Changes in application status will be tracked through
              the website as well.
            </v-card-text>
          </v-card>

          <v-card v-if="!isAuthenticated">
            <v-card-title>Login Required</v-card-title>
            <v-card-text
              >Our application requires you to
              <a href="/login">login with Battle.net</a> so we may access your
              characters. Its fast and secure; the only information provided to
              our website by Blizzard is your BattleTag and which characters you
              own.
            </v-card-text>
          </v-card>

          <template v-else>
            <v-card :loading="characterStatus === 'loading'" class="my-4">
              <v-card-title>Select your Characters</v-card-title>

              <v-card-text>
                Select a main character and optionally any alts you wish for us
                to view.
                <v-alert v-if="characterError" type="error">{{
                  characterError
                }}</v-alert>

                <v-row>
                  <v-col sm="12" md="6">
                    <v-select
                      v-model="mainCharacter"
                      label="Main Character"
                      hint="Pick your current main character or character you wish to use."
                      persistent-hint
                      :items="characters"
                      item-text="name"
                      return-object
                      filled
                      chips
                    >
                      <template v-slot:item="{ item, index }">
                        <v-avatar class="mr-3 mb-2">
                          <v-img :src="avatarFromCharacter(item)" />
                        </v-avatar>

                        <span :class="`class-color-${item.class} mr-2`">{{
                          item.name
                        }}</span>
                        <span>{{ item.realm }} - {{ item.level }}</span>
                      </template>
                    </v-select>
                  </v-col>

                  <v-col>
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
                        filled
                        :disabled="!isMainSelected"
                        chips
                      >
                        <template v-slot:item="{ item, index }">
                          <v-avatar class="mr-3 mb-2">
                            <v-img :src="avatarFromCharacter(item)" />
                          </v-avatar>

                          <span :class="`class-color-${item.class} mr-2`">{{
                            item.name
                          }}</span>
                          <span>{{ item.realm }} - {{ item.level }}</span>
                        </template>
                      </v-select>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card-text>

              <v-card-actions class="action-shadow">
                <template v-if="characterStatus === 'loading'">
                  Downloading characters...
                </template>

                <template v-else-if="isTokenInvalid">
                  <template v-if="characters && characters.length">
                    Expired Token + Characters Blizzard credentials expired.
                    Uses character data last updated
                    {{ relativeCharacterLastUpdated }}
                  </template>

                  <template v-else>
                    Expired Token No Characters
                  </template>
                </template>

                <template v-else>
                  <template v-if="characters && characters.length">
                    Characters last updated {{ relativeCharacterLastUpdated }}.
                    <v-btn text @click="getCharacters">Update Now</v-btn>
                  </template>

                  <template v-else>
                    Maybe Token No Characters
                  </template>
                </template>
              </v-card-actions>
            </v-card>

            <character-panel
              v-if="isCharacterDataAvailable"
              :name="mainCharacterFilled.name"
              :realm="mainCharacterFilled.realm"
              :region="mainCharacterFilled.region"
              :blizzard="mainCharacterFilled.blizzard"
              :raiderio="mainCharacterFilled.raiderIO"
            />

            <v-card v-for="field in fields" :key="field.id" class="my-4">
              <v-card-title>{{ field.question }}</v-card-title>
              <v-card-text><v-textarea filled></v-textarea></v-card-text>
            </v-card>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { AxiosError } from 'axios'
import { mapGetters } from 'vuex'
import { formatRelative } from 'date-fns'
import { Watch } from 'vue-property-decorator'
import { Character, KnownCharacter } from '../store/character'
import { User } from '../store/auth'
import { RaiderIOCharacter } from '../store/raiderIO'
import CharacterPanel from '@/components/blizzard/CharacterPanel.vue'
import Hero from '@/components/Hero.vue'

@Component({
  components: {
    CharacterPanel,
    Hero
  },
  computed: {
    ...mapGetters('auth', {
      user: 'user',
      isAuthenticated: 'isAuthenticated',
      isTokenInvalid: 'isTokenInvalid'
    }),
    ...mapGetters('character', {
      characterStatus: 'status',
      characterError: 'error',
      characters: 'characters',
      knownCharacters: 'knownCharacters',
      knownCharactersLastUpdated: 'knownCharactersLastUpdated',
      knownCharacterDataStale: 'knownCharacterDataStale'
    })
  },
  async fetch({ store }): Promise<void> {
    await store.dispatch('character/getKnownCharacters')
  }
})
export default class Apply extends Vue {
  title = 'Really Bad Application'
  caption = 'Interested in joining our guild?'
  background =
    'https://cdnassets.raider.io/images/login/backgrounds/bfa/froggo-loa.jpg'
  fields = [
    {
      id: 1,
      order: 1,
      type: 'TextArea',
      question: 'What is your name?',
      hint: 'Simple, Barbara',
      isRequired: true
    },
    {
      id: 2,
      order: 2,
      type: 'TextArea',
      question: 'What is your name?',
      hint: 'Simple, Barbara',
      isRequired: true
    },
    {
      id: 3,
      order: 3,
      type: 'TextArea',
      question: 'What is your name?',
      hint: 'Simple, Barbara',
      isRequired: true
    },
    {
      id: 4,
      order: 4,
      type: 'TextArea',
      question: 'What is your name?',
      hint: 'Simple, Barbara',
      isRequired: true
    },
    {
      id: 5,
      order: 5,
      type: 'TextArea',
      question: 'What is your name?',
      hint: 'Simple, Barbara',
      isRequired: true
    }
  ]
  // Non-Static Data
  mainCharacter: null | KnownCharacter = null
  mainCharacterFilled: null | KnownCharacter = null
  altCharacters: KnownCharacter[] = []
  altCharactersFilled: KnownCharacter[] = []
  // Auth Store
  user!: User
  isAuthenticated!: boolean
  isTokenInvalid!: boolean
  // Character Store
  characterStatus!: string
  characterError?: AxiosError
  characters?: Character[]
  knownCharacters?: KnownCharacter[]
  knownCharactersLastUpdated?: Date
  knownCharacterDataStale?: boolean

  // If we can potentially download characters, and not too quickly since
  // the last time, download them once mounted. This is a VERY slow API call.
  async mounted(): Promise<void> {
    if (this.isTokenInvalid || !this.knownCharacterDataStale) return

    await this.$store.dispatch('character/getUserCharactersFromBlizzard')
  }

  @Watch('mainCharacter')
  async onMainChanged(character: KnownCharacter): Promise<void> {
    const [blizzard, raiderIO] = await this.getCharacterData(
      character.name,
      character.realm,
      character.region
    )

    this.mainCharacterFilled = Object.assign({}, this.mainCharacter, {
      blizzard,
      raiderIO
    })
  }

  // Warning, this may need to be set to watch deep changes!
  @Watch('altCharacters')
  async onAltChanged(
    alts: KnownCharacter[],
    oldAlts: KnownCharacter[]
  ): Promise<void> {
    let chars: KnownCharacter[] = this.altCharactersFilled
    let added: KnownCharacter[] = []
    let removed: KnownCharacter[] = []

    added = oldAlts === null ? alts : alts.filter(a => oldAlts.includes(a))

    removed = oldAlts
      .filter(o => alts.includes(o))
      .concat(alts.filter(a => oldAlts.includes(a)))

    console.log('Added ', added)
    console.log('Removed ', removed)

    for (const character of removed) {
      chars = chars.filter(
        char =>
          char.name !== character.name &&
          char.realm !== character.realm &&
          char.region !== character.region
      )
    }

    for (const character of added) {
      const [blizzard, raiderIO] = await this.getCharacterData(
        character.name,
        character.realm,
        character.region
      )
      chars.push(Object.assign({}, character, { blizzard, raiderIO }))
    }

    this.altCharactersFilled = chars
  }

  get isSubmitted(): boolean {
    return true
  }

  get isTokenError(): boolean {
    return (
      this.characterError &&
      this.characterError.response &&
      this.characterError.response.data &&
      this.characterError.response.data.error === 'UnauthorizedToken'
    )
  }

  get selectedMainIndex(): number {
    return this.mainCharacter &&
      Object.entries(this.mainCharacter).length &&
      this.knownCharacters
      ? this.knownCharacters.indexOf(this.mainCharacter as KnownCharacter)
      : 0
  }

  get isMainSelected(): boolean {
    if (!this.mainCharacter) return false

    return Object.entries(this.mainCharacter).length !== 0
  }

  get isCharacterDataAvailable(): boolean {
    console.info('Recalculating')
    if (this.mainCharacter === null || this.mainCharacterFilled === null)
      return false
    if (!this.mainCharacterFilled.hasOwnProperty('blizzard')) return false
    if (typeof this.mainCharacterFilled.blizzard === 'undefined') return false

    return Object.entries(this.mainCharacterFilled.blizzard).length !== 0
  }

  get potentialAlts(): KnownCharacter[] {
    if (!this.mainCharacter || !this.knownCharacters) return []

    return this.knownCharacters.filter(c => c !== this.mainCharacter)
  }

  get relativeCharacterLastUpdated(): string {
    if (!this.knownCharactersLastUpdated) return 'never'

    return formatRelative(this.knownCharactersLastUpdated, new Date())
  }

  reauthenticate(): void {
    window.location.href = 'http://localhost:3000/auth/blizzard/login'
  }

  async getCharacters(): Promise<void> {
    await this.$store.dispatch('character/getUserCharactersFromBlizzard')
  }

  avatarFromCharacter(character: Character): string {
    return `http://render-us.worldofwarcraft.com/character/${character.thumbnail}?alt=/wow/static/images/2d/avatar/${character.race}-${character.gender}.jpg`
  }

  getCharacterData(
    name: string,
    realm: string,
    region: string
  ): Promise<[Character, RaiderIOCharacter]> {
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
  background: rgba(#000, 0.35);
}
</style>
