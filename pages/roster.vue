<template>
  <div>
    <hero :background="background" :title="title" :caption="caption" />

    <v-container>
      <v-row class="hero-nudge">
        <v-col v-for="character in characters" :key="character.id" cols="12" xs="12" sm="6" md="6" lg="4" xl="3">
          <character-window :character="character" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import Hero from '@/components/Hero.vue'
import CharacterWindow from '@/components/blizzard/CharacterWindow.vue'
import { Character } from '@/store/character'
import { characterStore } from '@/store'

@Component({
  components: {
    CharacterWindow,
    Hero
  },
  async fetch(): Promise<void> {
    await characterStore.getRoster()
  }
})
export default class Roster extends Vue {
  background = 'https://cdnassets.raider.io/images/login/backgrounds/bfa/octolegs.jpg'

  title = 'Really Bad Roster'
  caption = 'Our worst yearbook photos yet'

  get characters(): Character[] {
    return characterStore.roster
  }
}
</script>
