<template>
  <div @click="onClick">
    <div>
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const onClick = () => console.log('Clicky')

    return {
      onClick,
    }
  },
})
</script>
