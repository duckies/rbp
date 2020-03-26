<template>
  <div>
    <hero :background="background" :title="title" :caption="caption" />

    <v-container>
      <v-row class="hero-nudge">
        <v-col
          v-for="character in $store.state.roster.roster"
          :key="character.id"
          cols="12"
          xs="12"
          sm="6"
          md="6"
          lg="4"
          xl="3"
        >
          <character-window :character="character" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import Hero from '../components/Hero.vue'
import CharacterWindow from '../components/blizzard/CharacterWindow.vue'

@Component({
  components: {
    CharacterWindow,
    Hero,
  },
  async fetch({ store }): Promise<void> {
    await store.dispatch('roster/getRoster')
  },
})
export default class Roster extends Vue {
  background = 'https://cdnassets.raider.io/images/login/backgrounds/bfa/octolegs.jpg'
  title = 'Really Bad Roster'
  caption = 'Our worst yearbook photos yet'
}
</script>
