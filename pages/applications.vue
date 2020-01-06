<template>
  <div>
    <hero :background="background" :title="title" caption="caption" />

    <!-- Invalid Character Information Dialog -->
    <v-dialog v-model="invalidDialog" max-width="500">
      <v-card>
        <v-card-title>Missing Characters!?</v-card-title>
        <v-card-text>
          Blizzard's privacy requirements require invalid or expired character data to be deleted. Characters typically
          become invalid due to realm, race, or name changes or have not been logged into for a long time. Our guild
          website is required retrieve the status of all character data we store and update or remove it at least every
          30 days. Please contact Duckies on Discord at Duckies#1999 if you have any questions about the privacy of your
          character information.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="invalidDialog = !invalidDialog">
            OK!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-container class="hero-nudge">
      <!-- Pagination and Status Selector -->
      <v-row justify="end">
        <v-col>
          <v-card>
            <v-pagination v-model="paginationCurrent" :length="pagination.total" @input="onPageChange"></v-pagination>
          </v-card>
        </v-col>

        <v-col sm="3">
          <v-card>
            <v-select
              :value="statusCategory"
              label="Application Status"
              filled
              hide-details
              :items="formStatuses"
              @change="changeStatus"
            />
          </v-card>
        </v-col>
      </v-row>

      <!-- No Applications Found -->
      <v-row v-if="!submissions.length">
        <v-col>
          <v-card>
            <v-card-title>No Applications Found</v-card-title>
          </v-card>
        </v-col>
      </v-row>

      <!-- Form Submission Selectors -->
      <v-row v-else>
        <v-col v-for="submission in submissions" :key="submission.id" cols="12" sm="4">
          <v-card :to="`/applications/${submission.id}`" :class="classUnread(submission)">
            <v-row>
              <v-col cols="3">
                <v-row align="center" justify="center">
                  <v-avatar height="84" width="84">
                    <v-img
                      :class="defaultingClassBorderColor('class-avatar', submission.characters[0])"
                      :src="defaultingAvatar(submission.characters[0])"
                    ></v-img>
                  </v-avatar>
                </v-row>
              </v-col>

              <v-col>
                <h3>
                  {{ defaultingTitle(submission) }}
                </h3>
                <span v-if="submission.characters[0] && submission.characters[0].class_name">
                  {{ defaultingCharSubtitle(submission.characters[0]) }}
                </span>
                <span v-else>
                  Character Missing
                  <v-icon @click="invalidDialog = true">mdi-help-circle-outline</v-icon>
                </span>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <nuxt-child />
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import Hero from '@/components/Hero.vue'
import { submissionStore, formStore } from '@/store'
import { FormSubmission, Pagination, FormCharacter } from '@/store/submission'
import { Question } from '@/store/form'

@Component({
  components: {
    Hero
  }
})
export default class Applications extends Vue {
  private invalidDialog = false
  public readonly formStatuses = [
    { text: 'Open', value: 'open' },
    { text: 'Approved', value: 'approved' },
    { text: 'Rejected', value: 'rejected' },
    { text: 'Cancelled', value: 'cancelled' }
  ]

  get background(): string {
    return submissionStore.submission &&
      submissionStore.submission.characters &&
      submissionStore.submission.characters[0].render_url
      ? submissionStore.submission.characters[0].render_url
      : 'https://cdnassets.raider.io/images/login/backgrounds/bfa/blood-temple.jpg'
  }

  get title(): string {
    return `${
      submissionStore.submission &&
      submissionStore.submission.characters &&
      submissionStore.submission.characters[0].name
        ? submissionStore.submission.characters[0].name + ' Application'
        : 'Really Bad Applications'
    }`
  }

  get submission(): FormSubmission | null {
    return submissionStore.submission
  }

  get mainCharacter(): FormCharacter | null {
    return this.submission && this.submission.characters[0] ? this.submission.characters[0] : null
  }

  get submissions(): FormSubmission[] {
    return submissionStore.submissions
  }

  get formQuestions(): Question[] {
    return formStore.questions
  }

  get statusCategory(): string {
    return submissionStore.statusCategory
  }

  get pagination(): Pagination {
    return submissionStore.pagination
  }

  get paginationCurrent(): number {
    return submissionStore.pagination.current
  }

  set paginationCurrent(current: number) {
    submissionStore.setPaginationCurrent(current)
  }

  changeStatus(status: string): void {
    this.$router.push(`/applications/${status}`)
  }

  defaultingTitle(submission: FormSubmission): string {
    if (submission.characters[0]) {
      return submission.characters[0].name
    } else if (submission.author.displayname) {
      return submission.author.displayname
    } else {
      return submission.author.battletag
    }
  }

  defaultingAvatar(character?: FormCharacter): string {
    if (character && character.avatar_url) {
      return character.avatar_url
    } else if (character && character.race_id && character.gender) {
      return `https://render-us.worldofwarcraft.com/shadow/avatar/${character.race_id}-${
        character.gender === 'Female' ? 1 : 0
      }.jpg`
    } else {
      return `https://render-us.worldofwarcraft.com/shadow/avatar/10-${Math.round(Math.random())}.jpg`
    }
  }

  defaultingCharSubtitle(character?: FormCharacter): string {
    if (character && character.race_name && character.class_name) {
      return `${character.race_name} ${character.class_name} Application`
    }

    return `Character Missing`
  }

  classUnread(submission: FormSubmission): object {
    return {
      unread: submission.seen
    }
  }

  defaultingClassBlur(character?: FormCharacter): object {
    const classObj = {}

    if (character && character.class_id) {
      Object.assign(classObj, {
        [`class-blur-bg-${character.class_id}`]: true
      })
    }

    return classObj
  }

  defaultingClassBorderColor(baseClass: string, character?: FormCharacter): object {
    const classObj = {
      [baseClass]: true
    }

    if (character && character.class_id) {
      Object.assign(classObj, {
        [`class-border-${character.class_id}`]: true
      })
    }

    return classObj
  }

  async onPageChange(page: number): Promise<void> {
    await submissionStore.getSubmissions({
      take: 6,
      skip: (page - 1) * 6,
      status: this.$route.params.status
    })
  }
}
</script>

<style lang="scss" scoped>
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
</style>
