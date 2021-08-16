<template>
  <p class="text">{{ value }}</p>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    value: {
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
