<template>
  <v-container>
    <v-col>
      <h1>Really Bad AddOns</h1>
      <p>
        Page not complete. You need Exorsus Raid Tools and WeakAuras, and probably timers of some sort, but we don't
        care.
      </p>
    </v-col>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  transition: 'slide-right',
})
export default class AboutAddons extends Vue {
  title = 'Really Bad Addons'
}
</script>
