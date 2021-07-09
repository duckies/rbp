<template>
  <div>
    <!-- Cancel Dialog -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title>Are you sure?</v-card-title>

        <v-card-text v-if="dialogType === 'cancelled'"
          >1 Cancelling an application is irreversible. However, you may submit
          another application after this one is cancelled.
        </v-card-text>

        <v-card-text v-else-if="dialogType === 'rejected'">
          Are you sure you want to reject this application?
        </v-card-text>

        <v-card-text v-else>
          Are you sure you want to approve this application?
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn text color="primary" @click="handleStatusChange(dialogType)">
            Proceed
          </v-btn>

          <v-btn text @click="dialog = false">Nevermind</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Character Window -->
    <template
      v-if="submission && submission.characters && submission.characters.length"
    >
      <CharacterPanel
        v-for="character in submission.characters"
        :key="character.id"
        :character="character"
      />
    </template>

    <template v-else>
      <v-card class="mb-4">
        <v-card-title>Character Evaporated</v-card-title>

        <v-card-text>
          The character was removed as it was no longer unavailable. Whenever a
          character becomes unavailable our website is required to remove the
          character information. This is mandated by Blizzard for privacy
          reasons.
        </v-card-text>
      </v-card>
    </template>

    <!-- Submission Management -->
    <v-scale-transition>
      <v-card v-if="submission" class="pa-4">
        <div class="info-wrap">
          <v-avatar size="100" class="info-avatar">
            <v-img :src="submission.author.avatar" />
          </v-avatar>

          <div>
            <h3>Author</h3>
            <p>{{ submission.author.discord_tag }}</p>
          </div>

          <div>
            <h3>Submitted</h3>
            <p>Submitted {{ format(submission.createdAt) }}</p>
          </div>

          <div>
            <h3>Application Status</h3>
            <p class="status">{{ submission.status }}</p>
          </div>

          <div v-if="isAuthor || isOfficer">
            <h3>Application Control</h3>

            <v-btn
              v-if="isAuthor"
              :loading="$store.state.submission.isLoading"
              outlined
              @click="handleOpenDialog(SubmissionStatus.Cancelled)"
            >
              Cancel
            </v-btn>

            <v-btn
              v-if="isOfficer"
              :loading="$store.state.submission.isLoading"
              outlined
              @click="handleOpenDialog(SubmissionStatus.Approved)"
            >
              Approve
            </v-btn>

            <v-btn
              v-if="isOfficer"
              :loading="$store.state.submission.isLoading"
              outlined
              @click="handleOpenDialog(SubmissionStatus.Rejected)"
            >
              Reject
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-scale-transition>

    <!-- Submission Answers -->
    <v-row>
      <v-col>
        <FormField
          v-for="question in questions"
          :key="question.id"
          :question="question"
          :read-only="true"
        />
      </v-col>
    </v-row>

    <!-- Imaa Dialog -->
    <v-dialog v-model="lightbox" max-width="80%">
      <v-img :src="lightbox_image" @click="lightbox = !lightbox" />
    </v-dialog>

    <!-- Images -->
    <v-row v-if="submission && submission.files && submission.files.length">
      <v-col v-for="file in submission.files" :key="file.id" md="4">
        <v-card>
          <v-img
            :src="process.env.FRONTEND_BASE_URL + file.path"
            aspect-ratio="1.7778"
            @click="createLightbox(file)"
          />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { formatRelative } from 'date-fns'
import {
  defineComponent,
  useContext,
  useFetch,
  useRoute,
  reactive,
  computed,
  toRefs,
} from '@nuxtjs/composition-api'
import {
  useAuth,
  useRaids,
  useSubmission,
  SubmissionStatus,
  useForm,
} from '@client/stores'
import { FileUpload } from '@client/interfaces/entities.interface'

export default defineComponent({
  validate({ params }) {
    return /^(\d+|open|approved|rejected|cancelled)$/.test(params.key)
  },
  transition(to, from) {
    if (!from) {
      return 'slide-left'
    }

    const toId = +to.params.key
    const fromId = +from.params.key

    if (!toId || !fromId) {
      return 'slide-left'
    }

    return toId < fromId ? 'slide-right' : 'slide-left'
  },
  setup() {
    const { redirect } = useContext()

    const submissionStore = useSubmission()
    const raidStore = useRaids()
    const formStore = useForm()
    const authStore = useAuth()
    const route = useRoute()

    const state = reactive({
      dialog: false,
      lightbox: false,
      lightbox_image: '',
      dialogType: SubmissionStatus.Cancelled,
    })

    const isOfficer = computed(() => authStore.isOfficer)
    const submission = computed(() => submissionStore.submission)
    const questions = computed(() => formStore.questions)

    const isAuthor = computed(() => {
      if (!authStore.user || !submissionStore.submission) return false

      return authStore.user.id === submissionStore.submission.author.id
    })

    useFetch(async () => {
      const id = parseInt(route.value.params.id, 10)
      const param = id ? { id } : { status: route.value.params.key }

      if (param.status) {
        await submissionStore.findAll({
          limit: 25,
          offset: 0,
          status: param.status,
        })

        if (submissionStore.submissions.length) {
          redirect(302, `/applications/${submissionStore.submissions[0].id}`)
        }
      } else {
        await Promise.all([
          submissionStore.findOne(+route.value.params.id),
          raidStore.findFeatured(),
        ])

        if (submissionStore.submission && !submissionStore.submissions.length) {
          await submissionStore.findAll({
            limit: 25,
            offset: 0,
            status: submissionStore.submission.status,
          })
        }
      }
    })

    const handleOpenDialog = (status: SubmissionStatus) => {
      state.dialogType = status
      state.dialog = true
    }

    const handleStatusChange = async (status: SubmissionStatus) => {
      if (!submission.value?.id) return

      try {
        await submissionStore.update(submission.value.id, status)

        state.dialog = false

        await Promise.all([
          submissionStore.findAll({
            limit: 6,
            offset: 0,
            status,
          }),
          submissionStore.findOne(undefined, status),
        ])
      } catch (error) {
        console.error('Some shit fucked up Mary')
      }
    }

    const createLightbox = (file: FileUpload) => {
      state.lightbox_image = process.env.FRONTEND_BASE_URL + file.path
      state.lightbox = true
    }

    const format = (date: string) => {
      if (isNaN(Date.parse(date))) {
        return 'Some time ago...'
      }

      return formatRelative(new Date(date), new Date())
    }

    return {
      ...toRefs(state),
      submission,
      questions,
      isAuthor,
      isOfficer,
      handleStatusChange,
      handleOpenDialog,
      SubmissionStatus,
      createLightbox,
      format,
    }
  },
})
</script>

<style lang="scss" scoped>
.info-wrap {
  display: grid;
  grid-template-columns: 0.5fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas: 'avatar . .' 'avatar . .';
}

.info-avatar {
  grid-area: avatar;
  margin-right: 16px;
  align-self: center;
  justify-self: center;
}

.status {
  text-transform: uppercase;
}

.dialog-buttons {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
