<template>
  <div v-swiper="swiper" class="swiper-container">
    <div class="swiper-wrapper">
      <div v-for="slide in slides" :key="slide.id" class="swiper-slide">
        <v-img :src="slide.image" height="600">
          <v-container fill-height class="swiper-content">
            <v-row>
              <v-col>
                <h1 class="swiper-content__title" v-text="slide.title" />
                <h4 class="swiper-content__caption" v-text="slide.subtitle" />
              </v-col>
            </v-row>
          </v-container>
        </v-img>
      </div>
    </div>

    <!-- Main Content Slot -->
    <div class="home--nudge">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, useFetch } from '@nuxtjs/composition-api'
import { useSlides } from '@/stores'
// import { SwiperOptions } from 'swiper'

export default defineComponent({
  setup() {
    const swiper = {
      preloadImages: false,
      lazy: true,
    }

    const slideStore = useSlides()

    useFetch(async () => await slideStore.findAll())

    return {
      swiper,
      slides: computed(() => slideStore.slides),
    }
  },
})
</script>

<style lang="scss" scoped>
@import url('swiper/swiper-bundle.css');

.home--nudge {
  position: relative;
  margin-top: -100px;
  z-index: 2;
}

.swiper {
  &-wrapper {
    width: 100%;
    height: 600px;
    box-sizing: inherit;
  }

  &-slide {
    &::after {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 400px;
      background: linear-gradient(to top, #141517, transparent 60%);
      content: '';
    }
  }

  &-content {
    position: relative;
    z-index: 2;

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
}
</style>
