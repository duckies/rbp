<template>
  <v-container>
    <v-col>
      <h1>Really Bad AddOns</h1>
      <p>
        Page not complete. You need Exorsus Raid Tools and WeakAuras, and
        probably timers of some sort, but we don't care.
      </p>
    </v-col>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  transition: 'slide-right',
  setup() {
    return {
      title: 'Really Bad AddOns',
    }
  },
})
</script>
