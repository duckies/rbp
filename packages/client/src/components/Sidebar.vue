<template>
  <div class="raiderIO">
    <v-card
      v-for="tier in raids"
      :key="tier.slug"
      height="200"
      class="border-card mb-4"
    >
      <!-- Fix this to ignore raids without backgrounds -->
      <v-img
        v-if="tier.background"
        :src="tier.background"
        class="card-expand"
        height="200"
        gradient="to bottom, rgba(32, 33, 36, 0.2), #202124"
      >
        <div class="raiderIO--summary">
          <span class="raiderIO--summary__text" v-text="tier.summary" />
        </div>

        <v-card-title>
          <span
            class="raiderIO--text raiderIO--text__difficulty"
            v-text="tier.difficulty"
          />
          <span
            class="raiderIO--text raiderIO--text__title"
            v-text="tier.name"
          />
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

    <v-row dense>
      <v-col v-for="raid in rankings" :key="raid.title" cols="4">
        <v-card height="120" class="raiderIO--rankings mb-4 border-card">
          <v-img :src="raid.background" class="card-expand">
            <v-card-title>
              <div class="raiderIO--ranking">
                <span class="raiderIO--ranking__title">{{ raid.title }}</span>
                <span class="raiderIO--ranking__value">{{ raid.rank }}</span>
              </div>
            </v-card-title>
          </v-img>
        </v-card>
      </v-col>
    </v-row>

    <InfoBox
      title="We are recruiting!"
      subtitle="We are always looking for really bad players to bolster our ranks."
      button-text="More info &amp; apply now"
      button-link="/apply"
      :background="$img('/images/sidebar/recruitment.jpg')"
    />

    <InfoBox
      title="Discord"
      :subtitle="online + ' online'"
      button-text="Join Our Discord"
      button-link="https://discord.gg/mbwbzAs"
      :background="$img('/images/sidebar/sylvanas.jpg')"
    />
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  useContext,
  useFetch,
} from '@nuxtjs/composition-api'
import { useDiscord, useRaids } from '@/stores'

export default defineComponent({
  setup() {
    const { $img } = useContext()
    const discordStore = useDiscord()
    const raidStore = useRaids()

    useFetch(async () => {
      await Promise.all([discordStore.getDiscord(), raidStore.findFeatured()])
    })

    const online = computed(() => discordStore.online)
    const raids = computed(() => raidStore.raids)

    const rankings = computed(() => [
      {
        rank: raids.value[0]?.world || 0,
        title: 'World',
        background: $img('/images/sidebar/azeroth.jpg'),
      },
      {
        rank: raids.value[0]?.region || 0,
        title: 'Region',
        background: $img('/images/sidebar/barrens.jpg'),
      },
      {
        rank: raids.value[0]?.realm || 0,
        title: 'Realm',
        background: $img('/images/sidebar/area-52.jpg'),
      },
    ])

    return { online, raids, rankings }
  },
})
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
      font-size: 1.1rem;
      text-transform: uppercase;
      flex-basis: 100%;
      line-height: 1;
    }

    &__value {
      font-family: 'Roboto Mono', sans-serif;
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
      font-size: 1.1rem;
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
      font-size: 1.5rem;
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
