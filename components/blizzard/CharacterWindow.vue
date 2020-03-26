<template>
  <div
    class="character elevation-5"
    :data-name="character.name"
    :data-class="character.class"
    :data-race="character.race"
  >
    <v-img class="character--bg__image" :src="character.render_url" height="280">
      <div class="character--content">
        <div class="character--avatars">
          <v-img
            :src="character.avatar_url"
            height="90"
            width="90"
            :class="'character--avatar class-border-' + character.class_id"
          />
          <!-- Not implemented yet -->
          <!-- <v-img :src="specIcon" height="33" width="33" :class="'character--spec class-border-' + character.class_id" /> -->
        </div>

        <div class="character--info">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="character--info__name" v-html="titledName" />
          <div class="character--info__rank" v-text="rank"></div>
        </div>
      </div>

      <div class="character--links">
        <a class="character--links__link" :href="armoryLink" target="blank">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34.25 34.25" class="character--links__icon">
            <circle cx="17.13" cy="17.13" r="14.13" style="fill: none;" />
            <path
              d="M44.13,40.34a17,17,0,0,0,0-20V16.2H39.92a17.07,17.07,0,0,0-19.65.24H16.12v4.22a17.11,17.11,0,0,0,0,19.33v4.47h4.47a17.11,17.11,0,0,0,19.33,0h4.21V40.34Zm-28-10A14.13,14.13,0,1,1,30.25,44.46,14.13,14.13,0,0,1,16.12,30.33Z"
              transform="translate(-13.13 -13.2)"
            />
            <path
              d="M33.42,23.22A1.18,1.18,0,0,1,34,24.51l-1.47,9-2.39-9.82-2.39,9.82-1.47-9a1.18,1.18,0,0,1,.58-1.29H21.61a5.07,5.07,0,0,1,1.56,2.62c1.11,5.84,1.26,6.84,2,11.7a3,3,0,0,1-.63,1.79h5a3.63,3.63,0,0,1-.24-1.4c0.21-1.32,1-4.94,1-4.94v0c0.31,1.86.6,3.58,0.81,4.9a3.63,3.63,0,0,1-.24,1.4h5a3,3,0,0,1-.63-1.79c0.73-4.87.89-5.87,2-11.7a5.07,5.07,0,0,1,1.56-2.62H33.42Z"
              transform="translate(-13.13 -13.2)"
            />
          </svg>
        </a>
        <a class="character--links__link" :href="raiderIOLink" target="blank">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" class="character--links__icon">
            <path
              d="M294.91,117.4a8.75,8.75,0,0,0,2.22-7.3c-.21-.8-.4-1.6-.63-2.4a8.93,8.93,0,0,0-5.68-5.31l-27.93-8.3a13.45,13.45,0,0,1-9.38-16l6.66-27.94a8.9,8.9,0,0,0-1-6.71A9.36,9.36,0,0,0,249,39.19l-28.41,6.55a13.73,13.73,0,0,1-16.24-9.22L195.91,9.05a8.89,8.89,0,0,0-5.27-5.52c-.91-.25-1.82-.46-2.74-.69A9,9,0,0,0,180.65,5L159.38,24.67a13.89,13.89,0,0,1-18.76,0L119.35,5a9,9,0,0,0-7.25-2.19c-.91.23-1.83.44-2.74.69a8.89,8.89,0,0,0-5.27,5.52L95.65,36.52a13.73,13.73,0,0,1-16.24,9.22L51,39.19a9.36,9.36,0,0,0-10.13,4.28,8.9,8.9,0,0,0-1,6.71l6.66,27.94a13.45,13.45,0,0,1-9.38,16l-27.93,8.3a8.89,8.89,0,0,0-5.68,5.32c-.23.79-.42,1.59-.63,2.39a8.72,8.72,0,0,0,2.22,7.3l20,20.92a13.31,13.31,0,0,1,0,18.44l-20,20.93a8.72,8.72,0,0,0-2.22,7.4c.19.74.37,1.47.57,2.2a9,9,0,0,0,5.74,5.4L37.11,201a13.44,13.44,0,0,1,9.38,16l-6.66,27.95a8.88,8.88,0,0,0,1.45,7.26,9.54,9.54,0,0,0,2.3,2.27A9.23,9.23,0,0,0,51,255.89l47-5a4.32,4.32,0,0,0,3.92-4.67c-1.57-16.95-8.93-80.33-11.7-104A17.51,17.51,0,0,1,96,127.13L142,85.9a12,12,0,0,1,16,0l46,41.23a17.53,17.53,0,0,1,5.78,15.08c-2.74,23.64-10.06,87.05-11.62,104a4.32,4.32,0,0,0,3.92,4.67l47,5a9.42,9.42,0,0,0,9.71-3.72,8.84,8.84,0,0,0,1.46-7.26L253.51,217a13.46,13.46,0,0,1,9.38-16l27.93-8.3a8.9,8.9,0,0,0,5.73-5.4c.21-.73.39-1.47.58-2.2a8.76,8.76,0,0,0-2.22-7.4l-20-20.93a13.32,13.32,0,0,1,0-18.44Z"
            />
            <path
              d="M154.55,124.05a6.09,6.09,0,0,0-9.1,0l-15.77,17.84a17.93,17.93,0,0,0-4.49,13l8,133.36a9.57,9.57,0,0,0,9.23,8.82q3.75.2,7.54.19t7.59-.19a9.56,9.56,0,0,0,9.23-8.83l8-133.34a17.93,17.93,0,0,0-4.5-13Z"
            />
          </svg>
        </a>
        <a :href="wclLink" target="_blank">
          <v-img src="/images/svg/warcraftlog-logo.png" width="30" height="30" style="margin: 0 7px;"></v-img>
        </a>
      </div>
    </v-img>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { Ranks } from '~/store/user'
import { Character } from '~/store/roster'

@Component
export default class CharacterWindow extends Vue {
  @Prop() readonly character!: Character

  get specIcon(): string {
    return `https://render-us.worldofwarcraft.com/icons/56/${this.character.specIcon}.jpg`
  }

  get titledName(): string {
    const name = `<span class="class-color-${this.character.class_id}"><strong>${this.character.name}</strong></span>`

    if (!this.character.title) return name

    return this.character.title.replace('{name}', name)
  }

  get rank(): string {
    return typeof this.character.guild_rank === 'number' ? Ranks[this.character.guild_rank] : 'none'
  }

  get armoryLink(): string {
    return `https://www.worldofwarcraft.com/en-us/character/us/${this.character.realm.toLowerCase()}/${this.character.name.toLowerCase()}`
  }

  get raiderIOLink(): string {
    return `https://raider.io/characters/us/${this.character.realm.toLowerCase()}/${this.character.name.toLowerCase()}`
  }

  get wclLink(): string {
    return `https://www.warcraftlogs.com/character/${this.character.region}/${
      this.character.realm
    }/${this.character.name.toLowerCase()}`
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/blizzard/classes.scss';

// Different races require different positionings

// Orc
// .character[data-race='2'] {
//   .character--bg__image {
//     width: 240%;
//     left: -18%;
//     bottom: 210px;
//   }
// }

// // Blood Elf
// .character[data-race='10'] {
//   .character--bg__image {
//     width: 240%;
//     left: -18%;
//     bottom: 238px;
//   }
// }

// // Nightborne
// .character[data-race='27'] {
//   .character--bg__image {
//     width: 240%;
//     left: -18%;
//     bottom: 210px;
//   }
// }

// // Zandalari Troll, Troll
// .character[data-race='31'],
// .character[data-race='8'] {
//   .character--bg__image {
//     width: 240%;
//     left: -18%;
//     bottom: 200px;
//   }
// }

// // Goblin
// .character[data-race='9'] {
//   .character--bg__image {
//     width: 240%;
//     left: -18%;
//     bottom: 300px;
//   }
// }

// // Highmountain Tauren, Tauren
// .character[data-race='28'],
// .character[data-race='6'] {
//   .character--bg__image {
//     width: 220%;
//     left: -18%;
//     bottom: 200px;
//   }
// }

.character {
  position: relative;
  overflow: hidden;

  &--bg {
    // position: absolute;
    // width: 230%;

    &::after {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: linear-gradient(to top, rgba(#0c0c0c, 0.8), transparent 50%);
      content: '';
      z-index: 1;
    }
  }

  &--content {
    display: grid;
    position: relative;
    align-items: center;
    align-content: center;
    padding: 20px 10px;
    grid-template-rows: 1fr 1fr;
    text-align: center;
  }

  &--avatars {
    display: grid;
    align-items: center;
    justify-content: center;
  }

  &--avatar {
    display: flex;
    justify-self: center;
    border-radius: 50%;
    border-width: 3px;
    border-style: solid;
  }

  &--spec {
    position: absolute;
    justify-self: center;
    position: relative;
    top: -20px;
    border-style: solid;
    border-width: 3px;
  }

  &--info {
    &__name {
      font-size: 18px;
      font-weight: 500;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
    }

    &__rank {
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
      display: block;
      font-weight: 500;
      width: 100%;
    }
  }
}

.character--links {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-color: rgba(#0c0c0c, 0.65);
  border-top: 1px solid lighten(#0c0c0c, 5%);
  color: #fff;

  &__icon {
    color: #fff;
    width: 30px;
    fill: #fff;
    transition: 0.2s;
    margin: 0 7px;
  }

  &__link {
    display: flex;
    align-items: center;
  }
}
</style>
