<template>
  <div>
    <hero :background="background" :title="title" :caption="caption" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import Hero from '@/components/Hero.vue'

@Component({
  components: {
    Hero
  }
})
export default class Apply extends Vue {
  title = 'Really Bad Application'
  caption = 'Join our guild'
  background =
    'https://cdnassets.raider.io/images/login/backgrounds/bfa/froggo-loa.jpg'
}
</script>
