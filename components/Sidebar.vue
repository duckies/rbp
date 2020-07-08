<template>
  <div class="raiderIO">
    <v-card v-for="tier in $store.state.raid.raids" :key="tier.slug" height="200" class="mb-4">
      <!-- Fix this to ignore raids without backgrounds -->
      <v-img
        v-if="tier.background"
        :src="tier.background"
        class="image-hover"
        height="200"
        gradient="to bottom, rgba(32, 33, 36, 0.2), #202124"
      >
        <div class="raiderIO--summary">
          <span class="raiderIO--summary__text" v-text="tier.summary" />
        </div>

        <v-card-title>
          <span class="raiderIO--text raiderIO--text__difficulty" v-text="tier.difficulty" />
          <span class="raiderIO--text raiderIO--text__title" v-text="tier.name" />
        </v-card-title>

        <v-card-text>
          <v-progress-linear
            class="raiderIO--progress"
            rounded
            :value="tier.progress * 100"
            height="25"
            color="#854feb"
            background-color="#854feb"
            background-opacity=".3"
          />
        </v-card-text>
      </v-img>
    </v-card>

    <v-layout v-if="$store.getters['raid/rankings'].length" wrap>
      <v-flex v-for="(raid, index) in $store.getters['raid/rankings']" :key="index" xs4>
        <v-card height="120" class="mb-4">
          <v-img :src="raid.background">
            <v-card-title>
              <div class="raiderIO--ranking">
                <span class="raiderIO--ranking__title">{{ raid.rank }}</span>
                <span class="raiderIO--ranking__value">{{ raid.title }}</span>
              </div>
            </v-card-title>
          </v-img>
        </v-card>
      </v-flex>
    </v-layout>

    <info-box
      title="We are recruiting!"
      subtitle="We are always looking for really bad players to bolster our ranks."
      button-text="More info &amp; apply now"
      button-link="/apply"
      background="https://s3.amazonaws.com/files.enjin.com/632721/material/images/sidebar/recruitment.jpg"
    />
    <info-box
      title="Discord"
      :subtitle="$store.getters['discord/online'] + ' members currently online.'"
      button-text="Join Our Discord"
      button-link="https://discord.gg/mbwbzAs"
      background="https://s3.amazonaws.com/files.enjin.com/632721/material/images/sidebar/WLOP.jpg"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

export interface Ranking {
  rank: number
  title: string
  background: string
}

@Component
export default class Sidebar extends Vue {}
</script>

<style lang="scss" scoped>
.raiderIO {
  &--ranking {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;
    align-content: center;
    width: 100%;
    height: 95px;
    font-weight: 700;
    text-shadow: #000 0 0 3px;

    &__title {
      flex-basis: 100%;
      line-height: 1;
    }

    &__value {
      font-size: 0.9rem;
    }
  }
  &--summary {
    position: absolute;
    top: 15px;
    right: 15px;
    background-color: #202124;
    border-radius: 2px;
    padding: 5px 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);
    font-weight: 700;

    &__text {
      color: #fff;
      font-size: 0.9rem;
    }
  }

  &--text {
    flex-basis: 100%;
    text-shadow: 0 2px 5px rgba(0, 0, 0, 0.85);
    text-transform: uppercase;
    margin-left: 5px;
    font-weight: 700;

    &__difficulty {
      margin-top: 10%;
      font-size: 1.1rem;
      color: #854feb;
    }

    &__title {
      font-size: 1.2rem;
    }
  }
}

.ranking--location {
  display: block;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  opacity: 0.8;
}

.ranking--rank {
  display: block;
  font-size: 25px;
  font-weight: 700;
}
</style>

<style lang="scss">
.raiderIO {
  .v-progress-linear--rounded {
    border-radius: 100px;
  }

  .v-progress-linear__background {
    left: 0 !important;
    width: 100% !important;
  }

  .v-progress-linear {
    display: flex;
    align-items: center;
    padding: 0 6px;

    .v-progress-linear__determinate {
      height: 50%;
      border-radius: 100px;
    }
  }
}
</style>
