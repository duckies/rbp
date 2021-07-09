<template>
  <v-container>
    <v-col>
      <h1>Really Bad Loot</h1>
      <p>Page not complete. We use loot council so on so forth.</p>
    </v-col>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  transition(_to, from) {
    if (from) {
      if (from.name === 'about-addons') {
        return 'slide-left'
      } else if (from.name === 'about-ranks') {
        return 'slide-right'
      }
    }

    return 'slide-left'
  },
  setup() {
    return {
      title: 'Really Bad Loot',
    }
  },
})
</script>
