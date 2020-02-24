<template>
  <div>
    <!-- Cancel Dialog -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title>Are you sure?</v-card-title>
        <v-card-text v-text="dialogTexts[dialogType]"></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
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

    <!-- Submission Management -->
    <v-scale-transition>
      <v-card v-if="submission" class="pa-4">
        <v-row>
          <v-col>
            <v-row>
              <v-col cols="auto">
                <v-avatar>
                  <v-img :src="authorAvatar"></v-img>
                </v-avatar>
              </v-col>
              <v-col>
                <h3>Author</h3>
                <span>{{ authorName }}</span>
                <h3>Submitted</h3>
                <span>Submitted {{ formatRelative(submission.createdAt) }}</span>
              </v-col>
            </v-row>
          </v-col>

          <v-col>
            <v-row>
              <v-col>
                <h3>Application Status</h3>
                <span class="status">{{ submission.status }}</span>

                <template v-if="loggedIn && (isAuthor || isMod)">
                  <h3>Application Control</h3>
                  <v-btn
                    v-if="isAuthor"
                    text
                    :loading="submissionStoreLoading"
                    @click="
                      dialogType = 'cancelled'
                      dialog = true
                    "
                    >Cancel</v-btn
                  >
                  <v-btn
                    v-if="isMod"
                    text
                    :loading="submissionStoreLoading"
                    @click="
                      dialogType = 'approved'
                      dialog = true
                    "
                    >Approve</v-btn
                  >
                  <v-btn
                    v-if="isMod"
                    text
                    :loading="submissionStoreLoading"
                    @click="
                      dialogType = 'rejected'
                      dialog = true
                    "
                    >Reject</v-btn
                  >
                </template>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-scale-transition>

    <!-- Submission Answers -->
    <v-row>
      <v-col>
        <form-field v-for="question in formQuestions" :key="question.id" :question="question" :read-only="true" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { formatRelative } from 'date-fns'
import FormField from '@/components/fields/FormField.vue'
import CharacterPanel from '@/components/blizzard/CharacterPanel.vue'
import { formStore, submissionStore, discordStore, authStore, raidStore } from '@/store'
import { FormCharacter } from '@/store/character'
import { Question } from '@/store/form'
import { FormSubmission, SubmissionStatus } from '@/store/submission'

@Component({
  components: {
    FormField,
    CharacterPanel
  },
  validate({ params }) {
    return /^(\d+|open|approved|rejected|cancelled)$/.test(params.key)
  },
  async fetch({ redirect, params }) {
    const id = parseInt(params.key, 10)
    const param = id ? { id } : { status: params.key }
    const promises: Promise<unknown>[] = [
      discordStore.getDiscord(),
      submissionStore.getSubmissions({ take: 6, skip: 0, ...param }),
      submissionStore.getSubmission(param)
    ]

    if (!raidStore.raids || !raidStore.raids.length) {
      promises.push(raidStore.getRaids())
    }

    await Promise.all(promises)

    // TODO: Fix double download this kind of redirect causes.
    if (param.status && submissionStore.submission && submissionStore.submission.id) {
      redirect(302, `/applications/${submissionStore.submission.id}`)
    }
  }
})
export default class ApplicationKey extends Vue {
  private dialog = false

  private dialogType: SubmissionStatus = SubmissionStatus.Cancelled

  private readonly dialogTexts = {
    cancelled:
      'Cancelling an application is irreversible. However, you may submit another application after this one is cancelled.',
    approved: 'Are you sure you want to approve this application?',
    rejected: 'Are you sure you want to reject this application?'
  }

  get loggedIn(): boolean {
    return authStore.loggedIn
  }

  get isAuthor(): boolean {
    return (
      !!authStore.user && !!this.submission && this.submission.author && authStore.user.id === this.submission.author.id
    )
  }

  get isMod(): boolean {
    return true
  }

  get mainCharacter(): FormCharacter | undefined {
    return submissionStore.mainCharacter
  }

  get submission(): FormSubmission | null {
    return submissionStore.submission
  }

  get submissionStoreLoading(): boolean {
    return submissionStore.status === 'loading'
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
    return formStore.questions
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
    console.log('Changing submission status..')
    if (!this.submission || !this.submission.id) return

    await submissionStore.updateSubmission({ status })

    if (submissionStore.status === 'success') {
      this.dialog = false

      await Promise.all([
        submissionStore.getSubmissions({ take: 6, skip: 0, status }),
        submissionStore.getSubmission({ status })
      ])
    }
  }
}
</script>

<style lang="scss" scoped>
.status {
  text-transform: uppercase;
}
</style>
