<template>
  <hero :title="title" :background="background" :caption="caption">
    <v-row>
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
  </hero>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
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
