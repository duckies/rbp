<template>
  <div class="discord">
    <div class="discord-title">Discord</div>

    <div v-if="$fetchState.error" class="discord-error">
      Void lords are assaulting Discord's servers. Information temporarily
      stealthed.
    </div>

    <div v-else class="discord-channels">
      <v-row
        v-for="channel in channels"
        :key="channel.id"
        class="discord-channels--channel"
        no-gutters
      >
        <v-col>
          <div class="discord-channels--channel__title" v-text="channel.name" />

          <v-row
            v-for="member in channel.members"
            :key="member.id"
            class="discord-channels--channel__members"
          >
            <v-col>
              <v-avatar size="25" class="ml-4 mr-2">
                <v-img :src="member.avatar_url" />
              </v-avatar>

              <span v-text="member.nick ? member.nick : member.username" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { useDiscord } from '@client/stores'
import { computed, defineComponent, useFetch } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const discordStore = useDiscord()

    useFetch(async () => await discordStore.getDiscord())

    const channels = computed(() => discordStore.channels)

    return {
      channels,
    }
  },
})
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
    padding: 0 20px 0 20px;
    font-size: 19px;
    font-weight: 700;
  }

  &-error {
    padding: 10px 20px 20px 20px;
    font-family: 'Roboto Mono', sans-serif;
    font-size: 13px;
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
