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
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { formatRelative } from 'date-fns'
import { Article } from '../interfaces/entities.interface'

@Component
export default class BlogPost extends Vue {
  @Prop() readonly post!: Article

  get date(): string {
    return formatRelative(new Date(this.post.createdAt), new Date())
  }
}
</script>

<style lang="scss" scoped>
.article {
  &__title {
    font-weight: 700;
    text-transform: uppercase;
  }
}
</style>
