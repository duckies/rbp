<template>
  <v-container>
    <v-col>
      <h1>Really Bad Loot</h1>
      <p>
        Page not complete. We use loot council so on so forth.
      </p>
    </v-col>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  transition(to, from) {
    if (from) {
      if (from.name === 'about-addons') {
        return 'slide-left'
      } else if (from.name === 'about-ranks') {
        return 'slide-right'
      }
    }

    return 'slide-left'
  },
})
export default class AboutLoot extends Vue {
  title = 'Really Bad Ranks'
}
</script>
