<template>
  <Hero :title="title" :background="background">
    <!-- Admin Buttons -->
    <v-row>
      <v-col>
        <v-menu offset-y>
          <template #activator="{ on, attrs }">
            <v-btn large v-bind="attrs" v-on="on">
              Manage
              <v-icon right>mdi-chevron-down</v-icon>
            </v-btn>
          </template>

          <v-list dense nav>
            <DialogCreateIdentityStatus>
              <template #activator="{ on, attrs }">
                <v-list-item link v-bind="attrs" v-on="on">
                  <v-list-item-icon>
                    <v-icon>mdi-account-plus-outline</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>Add</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </DialogCreateIdentityStatus>

            <v-list-item link>
              <v-list-item-icon>
                <v-icon>mdi-account-edit-outline</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>Edit</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <template v-if="selections.length">
              <v-divider />

              <v-list-item link>
                <v-list-item-content>
                  <v-list-item-title>Mark Present</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>

    <!-- Attendance Table -->
    <v-row>
      <v-col>
        <v-card class="card-blur">
          <v-data-table
            v-model="selections"
            :items="raids"
            :headers="headers"
            show-select
          >
            <template #[`item.name`]="{ item }">
              {{ item.name }}
            </template>

            <template #[`item.role`]="{ item }">
              <v-avatar size="25" class="mr-2">
                <v-img :src="roleToImage(item.role)" />
              </v-avatar>

              <span>{{ item.role }}</span>
            </template>

            <template #[`item.status`]="{ item }">
              <DialogEditCell>
                <template v-if="!item.status"> - </template>

                <template v-else>
                  <span>{{ item.status.status }}</span>

                  <v-chip>{{ item.status.points }}</v-chip>
                </template>
              </DialogEditCell>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </Hero>
</template>

<script lang="ts">
import {
  RaidIdentity,
  RaidIdentityStatus,
} from '@client/interfaces/entities.interface'
import { useAuth } from '@client/stores'
import { useAttendance } from '@client/stores/useAttendance'
import {
  computed,
  defineComponent,
  useContext,
  useFetch,
  ref,
} from '@nuxtjs/composition-api'
import { RaidRole } from '@server/raid-identity/enums/raid-role.enum'
import { format } from 'date-fns'

const ROLE_SORT = Object.freeze({
  [RaidRole.TANK]: 1,
  [RaidRole.HEAL]: 2,
  [RaidRole.MELEE]: 3,
  [RaidRole.RANGED]: 4,
})

export interface Row extends RaidIdentity {
  status?: RaidIdentityStatus
}

export default defineComponent({
  setup() {
    const { $img } = useContext()
    const attendance = useAttendance()
    const authStore = useAuth()
    const selections = ref<Row[]>([])

    const sort = ref<'Role' | 'iLvl'>('Role')

    const headers = computed(() => [
      {
        text: 'Name',
        value: 'name',
      },
      {
        text: 'Role',
        value: 'role',
      },
      ...nights.value.map((night) => ({
        text: format(new Date(night.start), 'EEEE, MMM do, y'),
        value: 'status',
        align: 'center',
      })),
    ])

    const identities = computed(() => {
      switch (sort.value) {
        case 'Role':
          return attendance.identities.sort(
            (a, b) => ROLE_SORT[a.role] - ROLE_SORT[b.role]
          )
        default:
          return attendance.identities
      }
    })

    const raids = computed(() => {
      const retval = []

      for (const night of nights.value) {
        for (const identity of identities.value) {
          const status = night.statuses.find((status) => {
            if (typeof status.identity === 'number') {
              return status.identity === identity.id
            } else {
              return status.identity.id === identity.id
            }
          })

          retval.push({
            ...identity,
            status,
          })
        }
      }

      return retval
    })

    const nights = computed(() => attendance.nights)
    const isOfficer = computed(() => authStore.isOfficer)

    useFetch(async () => {
      await Promise.all([
        attendance.findAllIdentities(),
        attendance.findAllNights(),
      ])
    })

    const roleToImage = (role: RaidRole) =>
      $img(`/images/attendance/roles/${role.toLowerCase()}.jpg`)

    return {
      title: 'Really Bad Attendance',
      background: $img('/images/backgrounds/arbiter.webp'),
      identities,
      roleToImage,
      sort,
      nights,
      raids,
      headers,
      isOfficer,
      selections,
    }
  },
})
</script>

<style lang="scss" scoped>
.card-blur {
  backdrop-filter: blur(5px);
  background-color: rgba(32, 33, 36, 0.7) !important;
}
</style>
