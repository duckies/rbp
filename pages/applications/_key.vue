<template>
  <div>
    <!-- Cancel Dialog -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title>Are you sure?</v-card-title>
        <v-card-text v-text="dialogTexts[dialogType]"></v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text color="primary" @click="changeStatus(dialogType)">Proceed</v-btn>
          <v-btn text @click="dialog = false">Nevermind</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Character Window -->
    <template v-if="submission && submission.characters && submission.characters.length">
      <character-panel
        v-for="character in submission.characters"
        :key="character.id"
        :name="character.name"
        :realm="character.realm"
        :region="character.region"
        :blizzard="character"
        :raider-i-o="character.raiderIO"
      />
    </template>

    <template v-else>
      <v-card class="mb-4">
        <v-card-title>Character Evaporated</v-card-title>
        <v-card-text
          >The character was removed as it was no longer unavailable. Whenever a character becomes unavailable our
          website is required to remove the character information. This is mandated by Blizzard for privacy reasons.
        </v-card-text>
      </v-card>
    </template>

    <!-- Submission Management -->
    <v-scale-transition>
      <v-card v-if="submission" class="pa-4">
        <div class="info-wrap">
          <v-avatar size="100" class="info-avatar">
            <v-img :src="authorAvatar" />
          </v-avatar>

          <div>
            <h3>Author</h3>
            <p>{{ authorName }}</p>
          </div>

          <div>
            <h3>Submitted</h3>
            <p>Submitted {{ formatRelative(submission.createdAt) }}</p>
          </div>

          <div>
            <h3>Application Status</h3>
            <p class="status">{{ submission.status }}</p>
          </div>

          <div v-if="$store.getters['user/isLoggedIn'] && (isAuthor || isMod)">
            <h3>Application Control</h3>

            <v-btn
              v-if="isAuthor"
              :loading="$store.state.submission.isLoading"
              outlined
              @click="
                dialogType = 'cancelled'
                dialog = true
              "
              >Cancel</v-btn
            >
            <v-btn
              v-if="isMod"
              :loading="$store.state.submission.isLoading"
              outlined
              @click="
                dialogType = 'approved'
                dialog = true
              "
              >Approve</v-btn
            >
            <v-btn
              v-if="isMod"
              :loading="$store.state.submission.isLoading"
              outlined
              @click="
                dialogType = 'rejected'
                dialog = true
              "
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
        <form-field
          v-for="question in $store.getters['form/questions']"
          :key="question.id"
          :question="question"
          :read-only="true"
        />
      </v-col>
    </v-row>

    <!-- Image Dialog -->
    <v-dialog v-model="lightbox" max-width="80%">
      <v-img :src="lightbox_image" contain @click="lightbox = !lightbox" />
    </v-dialog>

    <!-- Images -->
    <v-row v-if="submission && submission.files && submission.files.length">
      <v-col v-for="file in submission.files" :key="file.id" md="4">
        <v-card>
          <v-img :src="baseFileURL + file.path" contain @click="createLightbox(file)" />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { formatRelative } from 'date-fns'
import { Question } from '~/store/form'
import { FormSubmission, SubmissionStatus, FileUpload } from '@/store/submission'

@Component({
  validate({ params }) {
    return /^(\d+|open|approved|rejected|cancelled)$/.test(params.key)
  },
  async fetch({ redirect, params, store }) {
    const id = parseInt(params.key, 10)
    const param = id ? { id } : { status: params.key }

    if (param.status) {
      await store.dispatch('submission/getSubmissions', {
        take: store.state.submission.pagination.page_size,
        skip: 0,
        status: param.status,
      })

      if (store.state.submission.submissions.length) {
        redirect(302, `/applications/${store.state.submission.submissions[0].id}`)
      }
    } else {
      await Promise.all([store.dispatch('submission/getSubmission', { id: param.id }), store.dispatch('raid/getRaids')])

      if (store.state.submission.submission && !store.state.submission.submissions.length) {
        await store.dispatch('submission/getSubmissions', {
          take: store.state.submission.pagination.page_size,
          skip: 0,
          status: store.state.submission.submission.status,
        })
      }
    }
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
})
export default class ApplicationKey extends Vue {
  private dialog = false
  private lightbox = false
  private lightbox_image = ''
  private dialogType: SubmissionStatus = SubmissionStatus.Cancelled
  private readonly dialogTexts = {
    cancelled:
      'Cancelling an application is irreversible. However, you may submit another application after this one is cancelled.',
    approved: 'Are you sure you want to approve this application?',
    rejected: 'Are you sure you want to reject this application?',
  }

  get isAuthor(): boolean {
    return (
      !!this.$store.state.user.user &&
      !!this.$store.state.submission.submission &&
      this.$store.state.submission.submission.author &&
      this.$store.state.user.user.id === this.$store.state.submission.submission.author.id
    )
  }

  get isMod(): boolean {
    return this.$store.getters['user/isOfficer']
  }

  get submission(): FormSubmission | null {
    return this.$store.state.submission.submission
  }

  get authorAvatar(): string {
    if (this.submission && this.submission.author && this.submission.author.discord_avatar) {
      const base = `https://cdn.discordapp.com/avatars/${this.submission.author.discord_id}/${this.submission.author.discord_avatar}`

      if (this.submission.author.discord_avatar.startsWith('a_')) {
        return `${base}.gif`
      } else {
        return `${base}.png`
      }
    }

    return 'https://render-us.worldofwarcraft.com/shadow/avatar/10-1.jpg'
  }

  get authorName(): string {
    if (this.submission && this.submission.author) {
      return `${this.submission.author.discord_username}#${this.submission.author.discord_discriminator}`
    }

    return 'Unknown User'
  }

  get formQuestions(): Question[] {
    return this.$store.state?.form.questions
  }

  get baseFileURL(): string {
    // return process.env.FRONTEND_BASE_URL + '/'
    return 'https://www.reallybadplayers.wtf/'
  }

  createLightbox(file: FileUpload): void {
    this.lightbox_image = this.baseFileURL + file.path
    this.lightbox = true
  }

  openDialog(status: SubmissionStatus): void {
    this.dialogType = status
    this.dialog = true
  }

  formatRelative(date: string): string {
    if (isNaN(Date.parse(date))) {
      return 'Some time ago...'
    }

    return formatRelative(new Date(date), new Date())
  }

  async changeStatus(status: SubmissionStatus): Promise<void> {
    if (!this.submission || !this.submission.id) return

    await this.$store.dispatch('submission/updateSubmission', { status })

    if (this.$store.state.submission.status === 'success') {
      this.dialog = false

      await Promise.all([
        this.$store.dispatch('submission/getSubmissions', { take: 6, skip: 0, status }),
        this.$store.dispatch('submission/getSubmission', { status }),
      ])
    }
  }
}
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
