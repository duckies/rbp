<template>
  <v-card elevation="5" height="250" class="article mb-4 justify-end-image-content">
    <v-img :src="post.header" height="250" class="image-hover" gradient="to bottom, transparent, #202124">
      <v-card-title>
        <div class="article--header">
          <div class="article__title" v-text="post.title" />
          <div class="article__subtitle" v-text="post.subtitle" />
        </div>
      </v-card-title>

      <v-layout row wrap class="article--footer">
        <v-flex class="article--footer__date">Posted {{ date }}</v-flex>
        <v-flex class="article--footer__more">
          <!-- Currently we don't have blog pages -->
          <!-- <v-btn :to="'/news/' + post.slug" text>
            Read More
          </v-btn> -->
        </v-flex>
      </v-layout>
    </v-img>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { formatRelative } from 'date-fns'
import { Article } from '../store/blog'

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
    font-family: Khand, sans-serif;
    font-size: 36px;
    font-weight: 700;
    text-transform: uppercase;
    line-height: 1.1;
    text-shadow: 0 2px 5px rgba(0, 0, 0, 0.85);
  }

  &__subtitle {
    font-size: 18px;
  }

  &--category {
    background-color: #854feb;
  }

  &--header {
    flex-grow: 0;
    margin-bottom: 5%;
  }

  &--footer {
    font-size: 15px;
    font-family: 'Roboto Mono', sans-serif;
    margin-bottom: 0 !important;
    flex-grow: 0;
    padding: 0 15px;
    background: rgba(20, 21, 23, 0.55);

    &__date {
      display: flex;
      align-items: center;
      text-transform: uppercase;
    }

    &__more {
      display: flex;
      align-content: center;
      justify-content: flex-end;
    }
  }
}
</style>
