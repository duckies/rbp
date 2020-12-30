<template>
  <p class="text">{{ text }}</p>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Component
export default class FormResponse extends Vue {
  @Prop() text!: string
}
</script>

<style scoped>
.text {
  word-break: break-word;
}
</style>
