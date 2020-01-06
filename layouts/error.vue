<template>
  <div>
    <hero :background="background" :title="title" :caption="caption" />

    <v-container class="hero-nudge">
      <v-card>
        <v-card-title v-if="error.statusCode === 404">Page not found</v-card-title>
        <v-card-title v-else>An error occured</v-card-title>
      </v-card>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import Hero from '@/components/Hero.vue'

@Component({
  components: {
    Hero
  }
})
export default class ErrorLayout extends Vue {
  @Prop() error!: Error

  background = '/images/backgrounds/about-background.jpg'
  title = 'Really Bad Error'
  caption = 'Something ookey spookey happened'
}
</script>
