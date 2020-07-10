<template>
  <v-app dark>
    <navigation />

    <v-main class="pa-0">
      <nuxt />
    </v-main>

    <footer-nav />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class DefaultLayout extends Vue {}
</script>
