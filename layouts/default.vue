<template>
  <v-app dark>
    <navigation />

    <v-content class="pa-0">
      <nuxt />
    </v-content>

    <footer-info />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class DefaultLayout extends Vue {}
</script>
