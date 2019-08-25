<template>
  <div>
    <hero :background="background" :title="title" :caption="caption" />

    <v-container>
      <div class="hero-nudge">
        <v-card height="800" class="thingy">
          <nuxt-child />
        </v-card>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Hero from '@/components/Hero.vue'

@Component({
  components: {
    Hero
  }
})
export default class AboutPage extends Vue {
  background = '/images/backgrounds/about-background.jpg'
  title = 'Really Bad Info'
  caption = 'Learn about our guild and things'
}
</script>

<style lang="scss" scoped>
.thingy {
  margin-bottom: 200px;
}
</style>
