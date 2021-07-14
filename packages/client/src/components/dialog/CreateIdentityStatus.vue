<template>
  <v-dialog max-width="500">
    <template #activator="activator">
      <slot name="activator" v-bind="activator" />
    </template>

    <v-card>
      <v-card-title>Create Identity</v-card-title>

      <FormValidated @form:submit="onSubmit">
        <v-card-text>
          <v-row>
            <v-col cols="3">
              <Autocomplete
                v-model="region"
                label="Region"
                :items="Regions"
                item-text="label"
                item-value="value"
                rules="required"
              />
            </v-col>

            <v-col>
              <Autocomplete
                v-model="realm"
                :items="RealmSlugs"
                label="Realm"
                item-text="name"
                item-value="slug"
                rules="required"
              />
            </v-col>

            <v-col>
              <TextField v-model="name" label="Name" rules="required" />
            </v-col>

            <v-col cols="6">
              <Select
                v-model="role"
                label="Role"
                :items="Roles"
                rules="required"
              >
                <template #selection="{ item }">
                  <v-avatar size="25" class="mr-2">
                    <v-img :src="attendance.getImageFromRole(item)" />
                  </v-avatar>

                  <span>
                    {{ item }}
                  </span>
                </template>

                <template #item="{ item }">
                  <v-avatar size="25" class="mr-2">
                    <v-img :src="attendance.getImageFromRole(item)" />
                  </v-avatar>

                  <span>
                    {{ item }}
                  </span>
                </template>
              </Select>
            </v-col>

            <v-col cols="6">
              <TextField
                v-model="discordTag"
                label="Discord (Optional)"
                rules="required"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn type="submit" color="primary">Submit</v-btn>
        </v-card-actions>
      </FormValidated>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Regions } from '@/interfaces/constants/regions'
import { Roles } from '@/interfaces/constants/roles'
import { RealmSlugs } from '@/interfaces/realms'
import { RealmSlug } from '@client/interfaces/constants/realm-slug.enum'
import { Region } from '@client/interfaces/constants/region.enum'
import { useAttendance } from '@client/stores/useAttendance'
import { defineComponent, reactive, toRefs } from '@nuxtjs/composition-api'
import { RaidRole } from '@server/raid-identity/enums/raid-role.enum'

export default defineComponent({
  setup() {
    const attendance = useAttendance()

    const state = reactive({
      region: Region.US,
      realm: RealmSlug.Area52,
      name: '',
      role: RaidRole.TANK,
      discordTag: '',
    })

    const onSubmit = async () => await attendance.createIdentity({ ...state })

    return {
      ...toRefs(state),
      onSubmit,
      RealmSlugs,
      Regions,
      Roles,
      attendance,
    }
  },
})
</script>
