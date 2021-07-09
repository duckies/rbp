<template>
  <v-card :loading="rosterStore.isLoading || downloading" class="mb-4">
    <v-card-title>Character Selection</v-card-title>

    <v-card-text>
      <p>Select your main character and any alts you wish to show to us.</p>

      <v-alert v-if="characterError.length" text error>
        {{ characterError }}
      </v-alert>

      <ValidationProvider v-slot="{ errors }" vid="provider">
        <v-row dense>
          <v-col cols="2">
            <v-autocomplete
              v-model="region"
              label="Region"
              :items="Regions"
              item-text="label"
              item-value="value"
              outlined
            />
          </v-col>

          <v-col>
            <v-autocomplete
              v-model="realm"
              label="Realm"
              :items="RealmSlugs"
              item-text="name"
              item-value="slug"
              return-object
              outlined
            />
          </v-col>

          <v-col>
            <v-text-field v-model="name" label="Name" outlined />
          </v-col>

          <v-col cols="auto">
            <v-btn
              :loading="rosterStore.isLoading || downloading"
              :disabled="!realm || !name"
              class="character-add"
              color="primary"
              outlined
              x-large
              @click="handleAddCharacter"
            >
              Add Character
            </v-btn>
          </v-col>

          <v-col v-if="errors.length" cols="12">
            {{ errors }}
          </v-col>
        </v-row>
      </ValidationProvider>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { useRoster, useSubmission } from '@client/stores'
import { defineComponent, reactive, toRefs } from '@nuxtjs/composition-api'
import { Region } from '@server/blizzard/enums/region.enum'
import { Regions } from '@/interfaces/constants/regions'
import { ValidationProvider } from 'vee-validate'
import { RealmSlugs, RealmList } from '../../interfaces/realms'

export default defineComponent({
  components: {
    ValidationProvider,
  },
  setup() {
    const submissionStore = useSubmission()
    const rosterStore = useRoster()

    const state = reactive({
      downloading: false,
      name: '',
      region: Region,
      characterError: '',
      realm: { name: '', slug: '' } as RealmList,
    })

    const handleAddCharacter = async () => {
      if (!state.realm || !state.name) return

      // Avoid trying to make requests when we already have this character.
      const hasCharacter = submissionStore.characters.find(
        (c) => c.name === state.name && c.realm === state.realm.slug
      )

      if (hasCharacter) {
        state.characterError = 'That character has already been entered.'
        return
      } else {
        state.characterError = ''
      }

      try {
        state.downloading = true

        const formCharacter = await rosterStore.getCharacterData({
          name: state.name,
          realm: state.realm.slug,
          region: Region.US,
        })

        submissionStore.characters.push(formCharacter)
      } catch (error) {
        console.error(error)
      } finally {
        state.downloading = false
      }
    }

    return {
      ...toRefs(state),
      RealmSlugs,
      handleAddCharacter,
      rosterStore,
      Region,
      Regions,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/blizzard/classes.scss';
</style>
