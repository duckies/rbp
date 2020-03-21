<template>
  <div class="carousel">
    <client-only>
      <flickity ref="flickity" :options="flickity">
        <div v-for="slide in slides" :key="slide.id" class="carousel-item" :data-flickity-bg-lazyload="slide.image">
          <div class="carousel-content">
            <v-container fill-height>
              <v-layout align-center>
                <v-flex class="carousel-content__box">
                  <h1 class="carousel-content__title" v-text="slide.title" />
                  <span class="carousel-content__caption" v-text="slide.subtitle" />
                </v-flex>
              </v-layout>
            </v-container>
          </div>
        </div>
      </flickity>

      <div slot="placeholder" class="flickity-placeholder"></div>
    </client-only>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Slide } from '@/store/slide'
import { slideStore } from '@/store'

@Component
export default class Carousel extends Vue {
  private flickity = {
    autoPlay: 5000,
    wrapAround: true,
    contain: true,
    bgLazyLoad: 1,
    pageDots: false,
    prevNextButtons: false,
    setGallerySize: false
  }

  get slides(): Slide[] {
    return slideStore.slides
  }
}
</script>

<style lang="scss" global>
@import '@/node_modules/flickity/dist/flickity.css';
</style>

<style lang="scss" scoped>
.carousel {
  width: 100%;
  height: 600px !important;

  .flickity-enabled {
    height: 100%;
  }

  &-content {
    position: relative;
    height: 100%;

    &__box {
      position: relative;
      bottom: 80px;
    }

    &__title {
      font-family: Khand, sans-serif;
      font-size: 3.5rem;
      text-transform: uppercase;
      line-height: 1.1;
      text-shadow: 4px 3px 4px #000;
    }

    &__caption {
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
      font-size: 1.2rem;
      display: block;
      font-weight: 500;
      width: 100%;
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
