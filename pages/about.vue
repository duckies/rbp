<template>
  <div>
    <hero :background="background" :title="title" :caption="caption" />

    <v-container>
      <div class="hero-nudge">
        <v-card>
          <v-tabs centered grow>
            <v-tab v-for="link in links" :key="link.to" nuxt to="/about/ranks">{{ link.title }}</v-tab>
          </v-tabs>
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
    Hero,
  },
})
export default class AboutPage extends Vue {
  background = '/images/backgrounds/about-background.jpg'
  title = 'Really Bad Info'
  caption = 'Learn about our guild and things'
  links = [
    { title: 'Ranks', to: '/about/ranks' },
    { title: 'Loot Distribution', to: '/about/loot' },
    { title: 'Required Addons', to: '/about/addons' },
  ]
}
</script>

<style lang="scss" scoped></style>
