<template>
  <div class="discord">
    <div class="discord-title">
      Discord
    </div>
    <div class="discord-channels">
      <div v-for="channel in channels" :key="channel.id" class="discord-channels--channel">
        <div class="discord-channels--channel__title" v-text="channel.name" />

        <div v-for="member in channel.members" :key="member.id" class="discord-channels--channel__members">
          <v-layout row wrap align-center>
            <v-flex shrink>
              <v-avatar size="25" class="ml-4 mr-2">
                <v-img :src="member.avatar_url" />
              </v-avatar>
            </v-flex>
            <v-flex>
              <span v-text="member.nick ? member.nick : member.username" />
            </v-flex>
          </v-layout>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Channel } from '../store/discord'

@Component
export default class Discord extends Vue {
  get channels(): Channel {
    return this.$store.getters['discord/channels']
  }
}
</script>

<style lang="scss" scoped>
.discord {
  // background-color: #202124;
  overflow-y: auto;
  height: 250px;

  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #854feb;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &-title {
    padding: 20px 20px 0 20px;
    font-size: 19px;
    font-weight: 700;
  }

  &-channels {
    padding: 10px 20px 20px 20px;
    font-family: 'Roboto Mono', sans-serif;
    font-size: 13px;

    &--channel {
      margin-bottom: 5px;
    }
  }
}
</style>
