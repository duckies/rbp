<template>
  <div>
    <carousel />

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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  async fetch({ store }): Promise<void> {
    await Promise.all([
      store.dispatch('blog/getArticles'),
      store.dispatch('raid/getRaids'),
      store.dispatch('slide/getSlides'),
    ])
  },
})
export default class Index extends Vue {}
</script>

<style lang="scss">
.hero-nudge {
  margin-top: -500px;

  &--home {
    transform: translateY(-120px);
  }
}
</style>
