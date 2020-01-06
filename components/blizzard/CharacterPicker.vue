<template>
  <v-card :loading="loading || downloading" class="mb-4">
    <v-card-title>Character Selection</v-card-title>

    <v-card-text>
      Select your main character first as the character you plan to raid with and optionally any alts you wish to show
      us.

      <v-select
        v-model="mainCharacter"
        :items="applicationCharacters"
        label="Main Character"
        class="mt-2"
        item-text="name"
        return-object
        outlined
        clearable
      >
        <template v-slot:item="{ item }">
          <v-avatar left>
            <v-img
              :src="
                `https://render-us.worldofwarcraft.com/character/${item.thumbnail}?alt=/wow/static/images/2d/avatar/${item.race}-${item.gender}.jpg`
              "
            />
          </v-avatar>
          {{ item.name }} - {{ item.realm }}
        </template>

        <template v-slot:selection="{ item }">
          <v-chip pill :class="`class-bg-${item.class}`">
            <v-avatar left>
              <v-img
                :src="
                  `https://render-us.worldofwarcraft.com/character/${item.thumbnail}?alt=/wow/static/images/2d/avatar/${item.race}-${item.gender}.jpg`
                "
              />
            </v-avatar>
            {{ item.name }}
          </v-chip>
        </template>
      </v-select>

      <v-slide-y-transition>
        <v-select
          v-show="mainCharacter"
          v-model="altCharacters"
          :items="possibleAltCharacters"
          label="Alt Characters (Optional)"
          multiple
          outlined
        >
          <template v-slot:item="{ item, select }">
            <v-checkbox @input="select($event)" />
            <v-avatar left>
              <v-img
                :src="
                  `https://render-us.worldofwarcraft.com/character/${item.thumbnail}?alt=/wow/static/images/2d/avatar/${item.race}-${item.gender}.jpg`
                "
              />
            </v-avatar>
            {{ item.name }} - {{ item.realm }}
          </template>

          <template v-slot:selection="{ item }">
            <v-chip :class="`class-bg-${item.class}`" pill>
              <v-avatar left>
                <v-img
                  :src="
                    `https://render-us.worldofwarcraft.com/character/${item.thumbnail}?alt=/wow/static/images/2d/avatar/${item.race}-${item.gender}.jpg`
                  "
                />
              </v-avatar>
              {{ item.name }}
            </v-chip>
          </template>
        </v-select>
      </v-slide-y-transition>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import slugify from 'slugify'
import { characterStore, submissionStore } from '../../store'
import { KnownCharacter } from '../../store/character'

@Component
export default class CharacterPicker extends Vue {
  private mainCharacter: KnownCharacter | null = null
  private altCharacters: KnownCharacter[] = []
  private downloading = false

  get loading(): boolean {
    return characterStore.isLoading
  }

  get applicationCharacters(): KnownCharacter[] {
    return characterStore.applicationCharacters
  }

  get possibleAltCharacters(): KnownCharacter[] {
    if (!this.mainCharacter || !this.applicationCharacters) return []

    return this.applicationCharacters.filter(c => c !== this.mainCharacter)
  }

  async mounted(): Promise<void> {
    await characterStore.getKnownCharacters()
  }

  @Watch('mainCharacter')
  async onMainChanged(character: KnownCharacter): Promise<void> {
    // When cleared character is null.
    if (!character) {
      submissionStore.setCharacters([])
      return
    }

    try {
      this.downloading = true

      const data = await characterStore.getCharacterData({
        name: character.name.toLowerCase(),
        realm: slugify(character.realm, { lower: true }),
        region: 'us'
      })

      console.log(data)
    } catch (error) {
      console.error(error)
    } finally {
      this.downloading = false
    }

    submissionStore.setCharacters([character, ...this.altCharacters])
  }

  @Watch('altCharacters')
  onAltsChanged(characters: KnownCharacter[]): void {
    if (!this.mainCharacter) return

    submissionStore.setCharacters([this.mainCharacter, ...characters])
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/blizzard/classes.scss';
</style>
