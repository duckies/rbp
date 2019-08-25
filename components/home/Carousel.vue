<template>
  <div class="carousel">
    <client-only>
      <flickity ref="flickity" :options="flickity">
        <div
          v-for="slide in slides"
          :key="slide.id"
          class="carousel-item"
          :data-flickity-bg-lazyload="slide.image"
        >
          <div class="carousel-content">
            <v-container fill-height>
              <v-layout align-center>
                <v-flex>
                  <h1 class="carousel-content__title" v-text="slide.title" />
                  <span
                    class="carousel-content__caption"
                    v-text="slide.subtitle"
                  />
                </v-flex>
              </v-layout>
            </v-container>
          </div>
        </div>
      </flickity>
    </client-only>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Slide } from '@/store/slide'

@Component
export default class Carousel extends Vue {
  flickity = {
    autoPlay: 5000,
    wrapAround: true,
    contain: true,
    bgLazyLoad: 1,
    pageDots: false,
    prevNextButtons: false,
    setGallerySize: false
  }

  get slides(): Slide {
    return this.$store.getters['slide/slides']
  }
}
</script>

<style lang="scss" scoped>
@import '@/node_modules/flickity/dist/flickity.css';

.carousel {
  width: 100%;
  height: 600px !important;

  .flickity-enabled {
    height: 100%;
  }

  &-content {
    position: relative;
    height: 100%;

    &__title {
      font-family: Khand, sans-serif;
      font-size: 70px;
      text-transform: uppercase;
      line-height: 1.1;
      text-shadow: 4px 3px 4px #000;
    }

    &__subtitle {
      font-size: 18px;
    }
  }

  &-item {
    height: 100%;
    width: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;

    &::before {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 400px;
      // background: rgba(20, 21, 23, 0.25) linear-gradient(to top, #141517, transparent 30%);
      background: repeat-x url('~assets/images/gradient.png');
      content: '';
    }
  }
}
</style>
