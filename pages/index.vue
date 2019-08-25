<template>
  <div>
    <carousel />

    <v-container grid-list-lg class="hero-nudge--home">
      <v-layout row wrap>
        <v-flex sm8>
          <blog-post
            v-for="article in articles"
            :key="article.id"
            :post="article"
          />
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
import { Article } from '@/store/blog'
import Carousel from '@/components/home/Carousel.vue'
import Sidebar from '@/components/Sidebar.vue'
import BlogPost from '@/components/BlogPost.vue'

@Component({
  components: {
    Carousel,
    Sidebar,
    BlogPost
  },
  async fetch({ store }): Promise<void> {
    await Promise.all([
      store.dispatch('slide/getSlides'),
      store.dispatch('raid/getFeaturedRaids'),
      store.dispatch('blog/getArticles'),
      store.dispatch('discord/getDiscord')
    ]).catch(e => e)
  }
})
export default class Index extends Vue {
  get articles(): Article[] {
    return this.$store.getters['blog/articles']
  }
}
</script>

<style lang="scss">
.hero-nudge {
  margin-top: -500px;

  &--home {
    transform: translateY(-120px);
  }
}
</style>
