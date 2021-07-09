<template>
  <v-card elevation="3" class="mb-4 border-card">
    <v-img
      :src="post.header"
      height="270"
      class="card-expand align-end pa-3"
      gradient="to top, #202124, transparent 50%"
    >
      <v-card-title class="article__title" v-text="post.title" />
      <v-card-subtitle class="article__subtitle" v-text="post.subtitle" />
    </v-img>
  </v-card>
</template>

<script lang="ts">
import { Article } from '@client/interfaces/entities.interface'
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'
import { formatRelative } from 'date-fns'

export default defineComponent({
  props: {
    post: {
      type: Object as PropType<Article>,
      required: true,
    },
  },
  setup(props) {
    const date = computed(() =>
      formatRelative(new Date(props.post.createdAt), new Date())
    )

    return { date }
  },
})
</script>

<style lang="scss" scoped>
.article {
  &__title {
    font-weight: 700;
    text-transform: uppercase;
  }
}
</style>
