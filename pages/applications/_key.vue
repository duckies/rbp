<template>
  <div>
    <!-- Cancel Dialog -->
    <v-dialog v-model="cancelDialog" max-width="600">
      <v-card>
        <v-card-title>Are you sure?</v-card-title>
        <v-card-text
          >Cancelling an application is irreversible. However, you may submit another application after this one is
          cancelled.</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="changeStatus('cancelled')">Cancel Application</v-btn>
          <v-btn text @click="cancelDialog = !cancelDialog">Nevermind</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Submission Management -->
    <v-scale-transition>
      <v-row v-if="Object.keys(submission).length">
        <v-col>
          <v-card>
            <v-row>
              <v-col sm="auto">
                <v-avatar>
                  <v-img :src="authorAvatar"></v-img>
                </v-avatar>
              </v-col>
              <v-col>
                <h3>Author</h3>
                <span>{{ authorName }}</span>
              </v-col>
              <v-col>
                <h3>Application Status</h3>
                <span>{{ submission.status }}</span>
              </v-col>
              <v-col>
                <h3>Application Control</h3>
                <v-btn text :loading="submissionStoreLoading" @click="cancelDialog = true">Cancel</v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
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
import FormField from '@/components/fields/FormField.vue'
import { formStore, submissionStore, discordStore } from '@/store'
import { Question } from '@/store/form'
import { FormSubmission, SubmissionStatus } from '@/store/submission'

@Component({
  components: {
    FormField
  },
  validate({ params }) {
    return /^(\d+|open|approved|rejected|cancelled)$/.test(params.key)
  },
  async fetch({ redirect, params }) {
    const id = parseInt(params.key, 10)
    const param = id ? { id } : { status: params.key }

    await Promise.all([
      discordStore.getDiscord(),
      submissionStore.getSubmissions({ take: 6, skip: 0, ...param }),
      submissionStore.getSubmission(param)
    ])

    // TODO: Fix double download this kind of redirect causes.
    if (param.status && submissionStore.submission && submissionStore.submission.id) {
      redirect(302, `/applications/${submissionStore.submission.id}`)
    }
  }
})
export default class ApplicationKey extends Vue {
  private cancelDialog = false

  get submission(): FormSubmission | null {
    return submissionStore.submission
  }

  get submissionStoreLoading(): boolean {
    return submissionStore.status === 'loading'
  }

  get authorAvatar(): string {
    if (this.submission && this.submission.author && this.submission.author.avatar) {
      return this.submission.author.avatar
    }
    return 'https://render-us.worldofwarcraft.com/shadow/avatar/10-1.jpg'
  }

  get authorName(): string {
    if (this.submission && this.submission.author && this.submission.author.displayname) {
      return this.submission.author.displayname
    } else if (this.submission && this.submission.author && this.submission.author.battletag) {
      return this.submission.author.battletag
    }

    return 'Deleted User'
  }

  get formQuestions(): Question[] {
    return formStore.questions
  }

  async changeStatus(status: SubmissionStatus): Promise<void> {
    if (!this.submission || !this.submission.id) return

    await submissionStore.updateSubmission({ status })

    if (submissionStore.status === 'success') {
      this.cancelDialog = false

      await Promise.all([
        submissionStore.getSubmissions({ take: 6, skip: 0, status }),
        submissionStore.getSubmission({ status })
      ])
    }
  }
}
</script>
