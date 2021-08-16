<template>
  <div>
    <!-- Invalid Character Information Dialog -->
    <v-dialog v-model="invalidDialog" max-width="500">
      <v-card>
        <v-card-title>Missing Characters?</v-card-title>

        <v-card-text>
          Blizzard's privacy requirements require invalid or expired character
          data to be deleted. Characters typically become invalid due to realm,
          race, or name changes or have not been logged into for a long time.
          Our guild website is required retrieve the status of all character
          data we store and update or remove it at least every 30 days. Please
          contact Duckies on Discord at Duckies#1999 if you have any questions
          about the privacy of your character information.
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn text @click="invalidDialog = !invalidDialog"> OK! </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <Hero
      :background="background"
      title="Really Bad Applications"
      caption="Blizzard's #1 source of transfer income since 2004"
    >
      <v-row>
        <!-- Left Sidebar -->
        <v-col cols="12" xs="12" md="5" lg="4" xl="3">
          <!-- Category Selectors -->
          <v-card>
            <v-select
              :value="statusCategory"
              class="px-5 py-4"
              label="Application Status"
              solo
              flat
              hide-details
              append-icon="mdi-chevron-down"
              menu-props="offset-y"
              :items="formStatuses"
              @change="handleChangeStatus"
            >
              <template #selection="{ item }">
                <div class="category-title">
                  {{ pagination.submission_total }} {{ item.text }} Applications
                </div>
              </template>
            </v-select>

            <v-divider />

            <v-card-text>
              <v-list-item-group>
                <v-list-item
                  v-for="submission in submissions"
                  :key="submission.id"
                  :to="`/applications/${submission.id}`"
                >
                  <v-list-item-avatar>
                    <v-img :src="submission.author.avatar" />
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title v-if="submission.mainCharacter">
                      {{ submission.mainCharacter.name }}
                    </v-list-item-title>

                    <v-list-item-title v-else>
                      {{ submission.author.discord_tag }}
                    </v-list-item-title>

                    <v-list-item-subtitle v-if="submission.mainCharacter">
                      {{ characterSubtitle(submission.characters[0]) }}
                    </v-list-item-subtitle>

                    <v-list-item-subtitle>
                      Submitted {{ format(submission.createdAt) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-card-text>

            <div class="pagination">
              <v-row>
                <v-col>
                  <v-row justify="end">
                    <v-btn
                      :disabled="pagination.page_current === 1"
                      text
                      @click="paginate(-1)"
                    >
                      <v-icon large>mdi-chevron-double-left</v-icon>
                    </v-btn>
                  </v-row>
                </v-col>
                <v-col cols="auto" class="d-flex justify-center align-center">
                  <span
                    >Page {{ pagination.page_current }} of
                    {{ pagination.page_total }}</span
                  >
                </v-col>
                <v-col>
                  <v-row justify="start">
                    <v-btn
                      :disabled="
                        pagination.page_current === pagination.page_total
                      "
                      text
                      @click="paginate(1)"
                    >
                      <v-icon large>mdi-chevron-double-right</v-icon>
                    </v-btn>
                  </v-row>
                </v-col>
              </v-row>
            </div>
          </v-card>

          <v-card
            class="discord-notif hidden-sm-and-down mt-4"
            href="https://discord.gg/mbwbzAs"
            target="_blank"
            rel="noreferrer"
          >
            <v-card-title>Want Notifications?</v-card-title>
            <v-card-text
              >Join our Discord to receive notifications from our server bot
              when the status of your application changes.
            </v-card-text>
          </v-card>
        </v-col>

        <v-col v-if="!submissions.length">
          <v-card>
            <v-card-title>No Applications Found</v-card-title>
          </v-card>
        </v-col>

        <v-col v-else>
          <v-row no-gutters>
            <v-col>
              <NuxtChild :key="$route.params.key" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </Hero>
  </div>
</template>

<script lang="ts">
import { useSubmission, useForm } from '@/stores'
import { FormCharacter } from '@client/interfaces/entities.interface'
import {
  computed,
  defineComponent,
  ref,
  useRouter,
} from '@nuxtjs/composition-api'
import { useScriptTag } from '@vueuse/core'
import { formatRelative } from 'date-fns'

export default defineComponent({
  setup() {
    const submissionStore = useSubmission()
    const formStore = useForm()
    const router = useRouter()

    const invalidDialog = ref(false)

    const submission = computed(() => submissionStore.submission)
    const submissions = computed(() => submissionStore.submissions)
    const questions = computed(() => formStore.questions)
    const statusCategory = computed(() => submission.value?.status)

    const title = computed(
      () =>
        submission.value?.characters?.[0].name + ' Application' ||
        'Really Bad Application'
    )

    const background = computed(
      () =>
        submission.value?.characters?.[0]?.media?.main ||
        'https://cdnassets.raider.io/images/login/backgrounds/bfa/blood-temple.jpg'
    )

    const characterSubtitle = (character?: FormCharacter) => {
      if (character && character.race_name && character.class.name) {
        return `${character.race_name} ${character.class.name} Application`
      }

      return 'Character Missing'
    }

    const handleChangeStatus = () => router.push(`/applications/${status}`)

    const format = (date: string) => formatRelative(new Date(date), new Date())

    useScriptTag('https://wow.zamimg.com/widgets/power.js')

    return {
      invalidDialog,
      submission,
      submissions,
      questions,
      title,
      background,
      statusCategory,
      handleChangeStatus,
      characterSubtitle,
      format,
      formStatuses: [
        { text: 'Open', value: 'open' },
        { text: 'Approved', value: 'approved' },
        { text: 'Rejected', value: 'rejected' },
        { text: 'Cancelled', value: 'cancelled' },
      ],
    }
  },
})
</script>

<style lang="scss" scoped>
.discord-notif:hover::before {
  transform: scale3d(1.2);
  transform: rotate(-25deg);
}

.discord-notif::before {
  background-image: url('~assets/images/svg/discord-logo-white.svg');
  background-repeat: no-repeat;
  background-position: right;
  color: transparent;
  opacity: 0.9;
  position: absolute;
  top: 25px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  height: 115px;
  content: '';
  transform: scale3d(1); // doesn't work at the moment, but oh well
  transform: rotate(-30deg);
  transition: transform cubic-bezier(0.075, 0.82, 0.165, 1) 500ms;
}

.discord-notif {
  overflow: hidden;
}

.class-avatar {
  border-width: 3px;
  border-style: solid;
}

.class-border {
  border-width: 1px;
  border-style: solid;
}

.unread {
  border: 2px solid pink;
}

.category-title {
  display: block;
  width: 100%;
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
}

.category-info {
  display: block;
  opacity: 0.8;
}

.pagination {
  background-color: rgba(#000, 0.2);
}
</style>
