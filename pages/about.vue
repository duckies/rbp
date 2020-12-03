<template>
  <hero :background="background" :title="title" :caption="caption">
    <v-card>
      <v-tabs centered grow>
        <v-tab v-for="link in links" :key="link.to" nuxt :to="link.to">{{ link.title }}</v-tab>
      </v-tabs>

      <nuxt-child />
    </v-card>
  </hero>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class AboutPage extends Vue {
  background = '/images/backgrounds/about-background.jpg'
  title = 'Really Bad Info'
  caption = 'Learn about our guild and things'
  links = [
    { title: 'Ranks', to: '/about/ranks' },
    { title: 'Rules', to: '/about/rules' },
    { title: 'Loot Distribution', to: '/about/loot' },
    { title: 'Required Addons', to: '/about/addons' },
  ]
}
</script>
