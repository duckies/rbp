<template>
  <Hero
    :title="error.statusCode || 'Unexpected Error'"
    caption="The website is under attack by baddies!"
  >
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Error</v-card-title>

          <v-card-text>
            <pre>{{ error }}</pre>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </Hero>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    error: {
      type: Object,
      required: true,
    },
  },
})
</script>
