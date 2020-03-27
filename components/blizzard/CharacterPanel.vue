<template>
  <div>
    <v-card v-if="!blizzard" class="left-border-rounded character class-border-5 mb-4">
      <v-card-title>Character Missing</v-card-title>
      <v-card-subtitle>Void lords have kidnapped your character.</v-card-subtitle>
      <v-card-text>
        The character <strong>{{ titledName }} - {{ realmName }}</strong> was not found or was in error. Please check
        the spelling and presence of any special characters. If the name and realm are correct, void lords may be
        assaulting Blizzard servers. Our website will retry the download periodically.
      </v-card-text>

      <v-layout>
        <v-row no-gutters>
          <v-col>
            <div class="character--footer">
              <span v-if="!applying" class="character--footer__text">{{ lastUpdated }}</span>
              <v-btn v-else-if="typeof order === 'number' && order !== 0" text @click="setMain">
                Set as Main Character
              </v-btn>
              <v-btn v-if="applying" text @click="removeCharacter">Remove Character</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-layout>
    </v-card>

    <v-card v-else :class="`left-border-rounded character class-border-${blizzard.class_id} mb-4`">
      <v-layout wrap>
        <v-row no-gutters :class="`character--bg class-logo-${blizzard.class_id}`">
          <v-col cols="auto" class="character--bg__clear ma-7">
            <v-row class="flex-column fill-height" no-gutters align="center" justify="center">
              <div>
                <v-img :src="avatar" height="84" width="84" :class="`thumbnail class-color-${blizzard.class_id}`" />
              </div>

              <h2 class="character--name mt-2">{{ titledName }}</h2>
              <span v-if="hasSpecData" class="character--info mb-2">
                {{ blizzard.specialization_name }} {{ blizzard.class_name }}
              </span>
              <span v-else class="character--info mb-2">{{ blizzard.race_name }} {{ blizzard.class_name }}</span>

              <div class="character--links">
                <a :href="`https://www.worldofwarcraft.com/en-us/character/${region}/${realm}/${name}`" target="_blank">
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
                <a :href="`https://www.raider.io/characters/${region}/${realm}/${name}`" target="_blank">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" class="character--links__icon">
                    <path
                      d="M294.91,117.4a8.75,8.75,0,0,0,2.22-7.3c-.21-.8-.4-1.6-.63-2.4a8.93,8.93,0,0,0-5.68-5.31l-27.93-8.3a13.45,13.45,0,0,1-9.38-16l6.66-27.94a8.9,8.9,0,0,0-1-6.71A9.36,9.36,0,0,0,249,39.19l-28.41,6.55a13.73,13.73,0,0,1-16.24-9.22L195.91,9.05a8.89,8.89,0,0,0-5.27-5.52c-.91-.25-1.82-.46-2.74-.69A9,9,0,0,0,180.65,5L159.38,24.67a13.89,13.89,0,0,1-18.76,0L119.35,5a9,9,0,0,0-7.25-2.19c-.91.23-1.83.44-2.74.69a8.89,8.89,0,0,0-5.27,5.52L95.65,36.52a13.73,13.73,0,0,1-16.24,9.22L51,39.19a9.36,9.36,0,0,0-10.13,4.28,8.9,8.9,0,0,0-1,6.71l6.66,27.94a13.45,13.45,0,0,1-9.38,16l-27.93,8.3a8.89,8.89,0,0,0-5.68,5.32c-.23.79-.42,1.59-.63,2.39a8.72,8.72,0,0,0,2.22,7.3l20,20.92a13.31,13.31,0,0,1,0,18.44l-20,20.93a8.72,8.72,0,0,0-2.22,7.4c.19.74.37,1.47.57,2.2a9,9,0,0,0,5.74,5.4L37.11,201a13.44,13.44,0,0,1,9.38,16l-6.66,27.95a8.88,8.88,0,0,0,1.45,7.26,9.54,9.54,0,0,0,2.3,2.27A9.23,9.23,0,0,0,51,255.89l47-5a4.32,4.32,0,0,0,3.92-4.67c-1.57-16.95-8.93-80.33-11.7-104A17.51,17.51,0,0,1,96,127.13L142,85.9a12,12,0,0,1,16,0l46,41.23a17.53,17.53,0,0,1,5.78,15.08c-2.74,23.64-10.06,87.05-11.62,104a4.32,4.32,0,0,0,3.92,4.67l47,5a9.42,9.42,0,0,0,9.71-3.72,8.84,8.84,0,0,0,1.46-7.26L253.51,217a13.46,13.46,0,0,1,9.38-16l27.93-8.3a8.9,8.9,0,0,0,5.73-5.4c.21-.73.39-1.47.58-2.2a8.76,8.76,0,0,0-2.22-7.4l-20-20.93a13.32,13.32,0,0,1,0-18.44Z"
                    />
                    <path
                      d="M154.55,124.05a6.09,6.09,0,0,0-9.1,0l-15.77,17.84a17.93,17.93,0,0,0-4.49,13l8,133.36a9.57,9.57,0,0,0,9.23,8.82q3.75.2,7.54.19t7.59-.19a9.56,9.56,0,0,0,9.23-8.83l8-133.34a17.93,17.93,0,0,0-4.5-13Z"
                    />
                  </svg>
                </a>
                <a :href="`https://www.warcraftlogs.com/character/${region}/${realm}/${name}`" target="_blank">
                  <v-img src="/images/svg/warcraftlog-logo.png" width="30" height="30" style="margin: 0 7px;" />
                </a>
              </div>
            </v-row>
          </v-col>

          <v-col class="character--bg__clear pa-4">
            <h3 class="character--header" :class="`class-color-${blizzard.class_id}`">Raid Progression</h3>
            <div v-if="raiderIO && raids">
              <div v-for="raid in $store.state.raid.raids" :key="raid.id">
                <div class="character--subheader">{{ raid.name }}</div>
                <v-progress-linear
                  :class="`character--progress class-progress-${blizzard.class_id}`"
                  :value="raids[raid.slug].progress"
                  height="20px"
                >
                  {{ raids[raid.slug].summary }}
                </v-progress-linear>
              </div>
            </div>
          </v-col>

          <v-col class="character--bg__clear pa-4">
            <h3 class="character--header" :class="`class-color-${blizzard.class_id}`">RaiderIO Scores</h3>

            <div v-if="raiderIO && raiderIO.mythic_plus_scores_by_season.length">
              <v-row>
                <v-col class="character--raiderIO">
                  <div :class="`character--raiderIO--score class-color-${blizzard.class_id}`">
                    {{ Math.round(raiderIO.mythic_plus_scores_by_season[0].scores.all) }}
                  </div>
                  <span>Current Season</span>
                </v-col>

                <v-col class="character--raiderIO">
                  <div :class="`character--raiderIO--score class-color-${blizzard.class_id}`">
                    {{ Math.round(raiderIO.mythic_plus_scores_by_season[1].scores.all) }}
                  </div>
                  <span>Last Season</span>
                </v-col>
              </v-row>
            </div>
            <span v-else>RaiderIO data was not available.</span>
          </v-col>

          <v-col cols="12" sm="12" lg="12" xl="4" class="character--bg__clear pa-4">
            <h3 class="character--header" :class="`class-color-${blizzard.class_id}`">Gear</h3>
            <div v-if="blizzard.equipment && blizzard.equipment.length > 0" class="character-item-grid">
              <div v-for="item in blizzard.equipment" :key="item.item.id">
                <a
                  :href="'https://www.wowhead.com/item=' + item.item.id"
                  :data-wowhead="wowheadTooltip(blizzard.class_id, item)"
                  target="blank"
                  :class="`item item-quality-border-${item.quality.name.toLowerCase()}`"
                >
                  <v-img
                    v-if="item.media && item.media.assets && item.media.assets.value"
                    :src="item.media.assets.value"
                    @:error="iconFailure"
                  />
                </a>
              </div>
            </div>
            <span v-else>Gear data was not found.</span>
          </v-col>
        </v-row>
      </v-layout>

      <v-layout>
        <v-row no-gutters>
          <v-col>
            <div class="character--footer">
              <span v-if="!applying" class="character--footer__text">{{ lastUpdated }}</span>
              <v-btn v-else-if="typeof order === 'number' && order !== 0" text @click="setMain">
                Set as Main Character
              </v-btn>
              <v-btn v-if="applying" text @click="removeCharacter">Remove Character</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-layout>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { formatRelative, differenceInDays, format } from 'date-fns'
import { Prop } from 'vue-property-decorator'
import { EquippedItemsEntity } from '../../interfaces/profile/profile-equipment.interface'
import { CharacterRaiderIO } from '../../interfaces/raiderIO/character.interface'
import { FormCharacter } from '../../store/roster'

interface ComputedRaidList {
  [slug: string]: ComputedRaid
}

interface ComputedRaid {
  progress: number
  summary: string
}

@Component
export default class CharacterPanel extends Vue {
  @Prop() readonly name!: string
  @Prop() readonly realm!: string
  @Prop() readonly realmName!: string
  @Prop() readonly region!: string
  @Prop() readonly blizzard?: FormCharacter
  @Prop() readonly raiderIO?: CharacterRaiderIO
  @Prop() readonly applying?: boolean
  @Prop() readonly order?: number

  get titledName(): string {
    return this.name.charAt(0).toUpperCase() + this.name.slice(1)
  }

  get hasSpecData(): boolean {
    return Boolean(this.blizzard && this.blizzard.specialization_id)
  }

  get lastUpdated(): string {
    if (this.applying) {
      return 'Not persisted.'
    }

    if (!this.blizzard?.updatedAt) {
      return 'Character retreival failed.'
    }

    const updatedAt = new Date(this.blizzard.updatedAt)
    const now = new Date()

    return Math.abs(differenceInDays(updatedAt, now)) < 6
      ? `Last updated ${formatRelative(updatedAt, now)}.`
      : format(updatedAt, `MM.dd a HH:mm`)
  }

  get raids(): ComputedRaidList {
    if (!this.raiderIO || !this.raiderIO.raid_progression || !Object.keys(this.raiderIO.raid_progression).length)
      return {}

    const raids = {}

    for (const slug in this.raiderIO.raid_progression) {
      Object.assign(raids, {
        [slug]: {
          // eslint-disable-next-line no-eval
          progress: eval(this.raiderIO.raid_progression[slug].summary.slice(0, -2)) * 100,
          summary: this.raiderIO.raid_progression[slug].summary,
        },
      })
    }

    return raids
  }

  get avatar(): string {
    if (this.blizzard && this.blizzard.avatar_url) {
      return this.blizzard.avatar_url
    } else if (this.blizzard && this.blizzard.race_id && this.blizzard.gender) {
      return `https://render-us.worldofwarcraft.com/shadow/avatar/${this.blizzard.race_id}-${
        this.blizzard.gender === 'Female' ? 1 : 0
      }.jpg`
    } else {
      return `https://render-us.worldofwarcraft.com/shadow/avatar/10-${Math.round(Math.random())}.jpg`
    }
  }

  iconFailure(thing: unknown): void {
    console.log(thing)
  }

  setMain(): void {
    if (typeof this.order === 'number') {
      this.$store.commit('submission/setMainCharacter', this.order)
    }
  }

  removeCharacter(): void {
    if (typeof this.order === 'number') {
      this.$store.commit('submission/removeCharacter', this.order)
    }
  }

  // TODO: Support set bonuses.
  wowheadTooltip(classId: number, item: EquippedItemsEntity): string {
    let str = ''

    if (item.level && item.level.value) {
      str += 'ilvl=' + item.level.value
    }

    if (item.bonus_list) {
      str += '&bonus=' + item.bonus_list.join(':')
    }

    if (item.azerite_details && item.azerite_details.selected_powers) {
      str += `&azerite-powers=${classId}:${item.azerite_details.selected_powers.map((p) => p.id).join(':')}`
    }

    if (item.enchantments) {
      str += `&ench=${item.enchantments.map((e) => e.enchantment_id).join(':')}`
    }

    if (item.sockets) {
      // This does not handle empty sockets yet.
      str += `&gems=${item.sockets.map((s) => (s.item ? s.item.id : '')).join(':')}`
    }

    return str
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/blizzard/classes.scss';
@import '@/assets/style/blizzard/items.scss';

.fill-height {
  height: 100%;
}

.render--wrapper {
  position: relative;
  z-index: 2;
}

.character--links {
  display: flex;
  justify-content: center;

  a {
    display: flex;
    align-items: center;

    svg {
      width: 30px;
      fill: #fff;
      margin: 0 7px;
    }
  }
}

.item {
  display: block;
  border-style: solid;
  border-width: 1px;
}

.character-item-grid {
  display: grid;
  grid-row-gap: 5px;
  grid-column-gap: 5px;
  grid-template-columns: repeat(auto-fill, minmax(45px, 60px));
}

.avatar-column {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.avatar-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.left-border-rounded {
  border-radius: 5px;
  border-left-width: 5px;
  border-left-style: solid;
}

.thumbnail {
  border: 3px solid;
}

.character {
  &--bg {
    position: relative;

    &::after {
      content: '';
      opacity: 0.5;
      position: absolute;
      top: 0;
      background-repeat: no-repeat;
      background-position: center center;
      align-self: center;
      width: 225px;
      height: 100%;
    }

    &__clear {
      position: relative;
      z-index: 2;
    }
  }

  &--header {
    margin-bottom: 10px;
  }

  &--name {
    color: #fff;
  }

  &--info {
    color: #fff;
  }

  &--progress {
    color: #fff;
    text-shadow: #000 0 0 3px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  &--raiderIO {
    padding: 0;
    text-align: center;

    &--score {
      font-size: 1.2rem;
      font-weight: bold;
    }
  }

  &--footer {
    padding: 10px;
    background-color: rgba(#0c0c0c, 0.65);
    border-top: 1px solid lighten(#0c0c0c, 5%);
  }
}
</style>
