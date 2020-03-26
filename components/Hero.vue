<template>
  <div class="hero">
    <div class="hero--bg">
      <v-img :src="background" :height="height" class="parallax-gradient" position="center" cover>
        <v-container>
          <v-layout>
            <v-row>
              <v-col>
                <h1 class="hero--header__title" v-text="title" />
                <span v-if="caption" class="hero--header__caption" v-text="caption" />
              </v-col>
            </v-row>
          </v-layout>
        </v-container>
      </v-img>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Component
export default class Hero extends Vue {
  @Prop(String) readonly title!: string
  @Prop(String) readonly caption!: string
  @Prop(String) readonly background!: string

  height = 800
}
</script>

<style lang="scss" scoped>
.parallax-gradient {
  overflow: hidden;

  .v-parallax__image-container::after {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 400px;
    background: repeat-x url('~assets/images/gradient.png');
    content: '';
    z-index: 5;
  }
}

.hero {
  position: relative;

  &--bg::after {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    // background: rgba(20, 21, 23, 0.25) linear-gradient(to top, #141517, transparent 50%);
    height: 400px;
    background: repeat-x url('~assets/images/gradient.png');
    content: '';
  }

  &--header {
    display: flex;
    flex-wrap: wrap;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    left: 0;

    &__text {
      margin-bottom: 830px;
    }

    &__title {
      font-family: 'Khand', sans-serif;
      font-weight: 900;
      font-size: 3.5rem;
      margin-top: 90px;
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
