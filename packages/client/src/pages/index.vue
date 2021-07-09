<template>
  <Carousel>
    <v-container grid-list-lg class="hero-nudge--home">
      <v-layout row wrap>
        <v-flex sm8>
          <BlogPost v-for="post in posts" :key="post.id" :post="post" />
        </v-flex>
        <v-flex sm4>
          <Sidebar />
        </v-flex>
      </v-layout>
    </v-container>
  </Carousel>
</template>

<script lang="ts">
import { useBlog } from '@client/stores'
import { computed, defineComponent, useFetch } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const blogStore = useBlog()

    const posts = computed(() => blogStore.posts)

    useFetch(async () => await blogStore.getPosts())

    return {
      posts,
    }
  },
})
</script>
