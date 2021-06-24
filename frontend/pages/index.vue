<template>
  <carousel>
    <v-container grid-list-lg class="hero-nudge--home">
      <v-layout row wrap>
        <v-flex sm8>
          <blog-post v-for="article in $store.state.blog.articles" :key="article.id" :post="article" />
        </v-flex>
        <v-flex sm4>
          <sidebar />
        </v-flex>
      </v-layout>
    </v-container>
  </carousel>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({})
</script>

