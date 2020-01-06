<template>
  <v-card :class="`left-border-rounded class-border-${classId} class-light-bg-${classId} mb-4`">
    <v-card-text class="ma-0 pa-0">
      <v-layout>
        <v-row>
          <v-col class="avatar-column">
            <v-img :src="thumbnail" height="84" width="84" :class="`thumbnail class-color-${classId}`" />
            <h2>{{ name }}</h2>
            <span>{{ raceName }} {{ className }}</span>
          </v-col>
          <v-col>
            <h3 class="character--header">Raid Progression</h3>
          </v-col>
          <v-col>
            <h3 class="character--header">RaiderIO Scores</h3>
          </v-col>
          <v-col>
            <h3 class="character--header">Gear</h3>
          </v-col>
          <v-col sm="12" class="py-0">
            <div :class="`character-footer class-light-bg-${classId}`">
              <span>Some texty text.</span>
            </div>
          </v-col>
        </v-row>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { RaiderIOCharacter } from '@/store/raiderIO'
import { Character } from '@/store/character'
import Races from '@/interfaces/races'
import Classes from '@/interfaces/classes'

@Component
export default class CharacterPanel extends Vue {
  @Prop() readonly name!: string
  @Prop() readonly realm!: string
  @Prop() readonly region!: string
  @Prop() readonly blizzard?: Character
  @Prop() readonly raiderio?: RaiderIOCharacter

  get classId(): number {
    if (typeof this.blizzard !== 'undefined') {
      return this.blizzard.class_id
    }

    return 0
  }

  get thumbnail(): string {
    if (typeof this.raiderio !== 'undefined' && this.raiderio.thumbnail_url) {
      return this.raiderio.thumbnail_url
    }

    // if (typeof this.blizzard !== 'undefined' && this.blizzard.thumbnail) {
    //   return `https://render-us.worldofwarcraft.com/character/${this.blizzard.thumbnail}`
    // }

    return '/images/avatars/generic-belf.jpg'
  }

  get className(): string {
    if (typeof this.blizzard === 'undefined') return 'Unknown'

    if (!Object.prototype.hasOwnProperty.call(Classes, this.blizzard.class_id)) {
      return 'Unknown'
    }

    return Classes[this.blizzard.class_id]
  }

  get raceName(): string {
    if (typeof this.blizzard === 'undefined') return 'Unknown'

    if (!Object.prototype.hasOwnProperty.call(Races, this.blizzard.race_id)) {
      return 'Unknown'
    }

    return Races[this.blizzard.race_id]
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/blizzard/classes.scss';

.avatar-column {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.left-border-rounded {
  border-left-width: 5px;
  border-left-style: solid;
}

.thumbnail {
  border: 3px solid;
}

.character {
  &-footer {
    padding: 10px;
  }
}
</style>
