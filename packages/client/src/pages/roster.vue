<template>
  <Hero :title="title" :background="background" :caption="caption">
    <v-row>
      <v-col
        v-for="character in roster"
        :key="character.id"
        cols="12"
        xs="12"
        sm="6"
        md="6"
        lg="4"
        xl="3"
      >
        <BlizzardCharacterWindow :character="character" />
      </v-col>
    </v-row>
  </Hero>
</template>

<script lang="ts">
import { defineComponent, useFetch, computed } from '@nuxtjs/composition-api'
import { useRoster } from '@/stores'

export default defineComponent({
  setup() {
    const rosterStore = useRoster()

    useFetch(async () => await rosterStore.getRoster())

    return {
      background:
        'https://cdnassets.raider.io/images/login/backgrounds/bfa/octolegs.jpg',
      title: 'Really Bad Roster',
      caption: 'Our worst yearbook photos yet',
      roster: computed(() => rosterStore.roster),
    }
  },
})
</script>
