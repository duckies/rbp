<template>
  <v-card :loading="$store.state.roster.isLoading || downloading" class="mb-4">
    <v-card-title>Character Selection</v-card-title>

    <v-card-text>
      Select your main character and any alts you wish to show to us.

      <v-alert v-if="characterError.length" text error>
        {{ characterError }}
      </v-alert>

      <v-row>
        <v-col>
          <!--  :rules="{ oneOf: realmSlugs, required: false }" does not check individual realm validity -->
          <validation-provider v-slot="{ errors }" vid="realm">
            <v-autocomplete
              v-model="realm"
              label="Realm"
              :items="realmSlugs"
              :error-messages="errors"
              item-text="name"
              item-value="slug"
              return-object
              outlined
            />
          </validation-provider>
        </v-col>
        <v-col>
          <v-text-field v-model="name" label="Name" outlined />
        </v-col>
        <v-col cols="auto">
          <v-btn
            :loading="$store.state.roster.isLoading || downloading"
            :disabled="!realm || !name"
            class="character-add"
            color="primary"
            outlined
            x-large
            @click="addCharacter"
            >Add Character</v-btn
          >
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { ValidationProvider } from 'vee-validate'
import { RealmSlugs, RealmList } from '../../interfaces/realms'
import { FormCharacterIdentity } from '../../store/submission'
import { CharacterLookupDto } from '../../interfaces/character-lookup.dto'

@Component({
  components: { ValidationProvider },
})
export default class CharacterPicker extends Vue {
  private downloading = false
  private realmSlugs = RealmSlugs
  private name = ''
  private characterError = ''
  private realm: RealmList = {
    name: '',
    slug: '',
  }

  async addCharacter(): Promise<void> {
    if (!this.realm || !this.name) {
      return
    }

    const character: FormCharacterIdentity = {
      name: this.name,
      realm: this.realm.slug,
      realm_name: this.realm.name,
      region: 'us',
    }

    // Avoid trying to make requests when we already have this character.
    const existing = this.$store.state.submission.characters.find(
      (c: CharacterLookupDto) =>
        c.name.toLowerCase() === character.name.toLowerCase() &&
        c.realm === character.realm &&
        c.region === character.region
    )

    if (existing) {
      this.characterError = 'That character has already been entered.'
      return
    } else {
      this.characterError = ''
    }

    try {
      this.downloading = true

      const { raiderIO, ...blizzard } = await this.$store.dispatch('roster/getCharacterData', character)

      character.blizzard = blizzard
      character.raiderIO = raiderIO
    } catch (error) {
      console.error(error)
    } finally {
      this.downloading = false
    }

    this.$store.commit('submission/addCharacter', character)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/blizzard/classes.scss';
</style>
