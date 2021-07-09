<template>
  <p class="text">{{ text }}</p>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    text: {
      type: String,
      required: true,
    },
  },
})
</script>

<style scoped>
.text {
  word-break: break-word;
}
</style>
