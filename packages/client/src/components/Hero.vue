<template>
  <div class="hero">
    <v-img
      :src="background"
      height="800"
      class="hero--bg"
      position="center"
      cover
    />

    <v-container class="hero--inner">
      <v-row class="hero--header">
        <v-col class="pa-0">
          <h1 class="hero--header__title" v-text="title" />
          <h4 v-if="caption" class="hero--header__caption" v-text="caption" />
        </v-col>
      </v-row>

      <!-- Main Content Slot -->
      <slot />
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: false,
      default: null,
    },
    background: {
      type: String,
      required: true,
    },
  },
  setup() {
    return {}
  },
})
</script>

<style lang="scss" scoped>
.hero {
  &--bg {
    position: absolute;
    width: 100%;

    &::after {
      background: linear-gradient(to top, #141517, transparent 60%);
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      content: '';
    }
  }

  &--inner {
    position: relative;
  }

  &--header {
    // Add the height of the navigation bar for the blur effect.
    margin: calc(5em + 64px) 0 5em 0;

    &__title {
      font-family: 'Khand', sans-serif;
      font-weight: 900;
      font-size: 3.5rem;
      line-height: 3.1rem;
      text-transform: uppercase;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
    }

    &__caption {
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
      font-size: 1.2rem;
      display: block;
      font-weight: 500;
      width: 100%;
    }
  }
}
</style>
