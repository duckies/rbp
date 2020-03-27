<template>
  <div>
    <hero
      background="https://cdnassets.raider.io/images/login/backgrounds/bfa/blood-temple.jpg"
      title="Really Bad Applications"
      caption="Blizzard's #1 source of transfer income since 2004"
    />

    <!-- Invalid Character Information Dialog -->
    <v-dialog v-model="invalidDialog" max-width="500">
      <v-card>
        <v-card-title>Missing Characters?</v-card-title>
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
      <v-row>
        <!-- Category Selectors -->
        <v-col cols="12" xs="12" md="5" lg="4" xl="3">
          <v-card>
            <v-select
              :value="statusCategory"
              class="px-5 py-4"
              label="Application Status"
              solo
              flat
              hide-details
              append-icon="mdi-chevron-down"
              :items="formStatuses"
              @change="changeStatus"
            >
              <template v-slot:selection="{ item }">
                <span class="category-title">{{ item.text }} Applications</span>
              </template>
            </v-select>

            <v-divider></v-divider>

            <v-card-text>
              <v-list-item-group>
                <v-list-item
                  v-for="submission in submissions"
                  :key="submission.id"
                  :to="`/applications/${submission.id}`"
                >
                  <v-list-item-avatar>
                    <v-img :src="avatar(submission.author)" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-if="submission">{{ defaultingTitle(submission) }}</v-list-item-title>
                    <v-list-item-subtitle v-if="submission.characters && submission.characters[0]">{{
                      defaultingCharSubtitle(submission.characters[0])
                    }}</v-list-item-subtitle>
                    <v-list-item-subtitle> Submitted {{ formatDate(submission.createdAt) }} </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
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
              <nuxt-child />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { formatRelative } from 'date-fns'
import { FormCharacter } from '~/store/roster'
import Hero from '~/components/Hero.vue'
import { FormSubmission, Pagination } from '~/store/submission'
import { Avatars, User } from '~/store/user'
import { Question } from '~/store/form'

@Component({
  components: {
    Hero,
  },
})
export default class Applications extends Vue {
  private invalidDialog = false
  public readonly formStatuses = [
    { text: 'Open', value: 'open' },
    { text: 'Approved', value: 'approved' },
    { text: 'Rejected', value: 'rejected' },
    { text: 'Cancelled', value: 'cancelled' },
  ]

  get submissionBackground(): string {
    return this.$store.state.submission.submission &&
      this.$store.state.submission.submission.characters &&
      this.$store.state.submission.submission.characters[0].render_url
      ? this.$store.state.submission.submission.characters[0].render_url
      : 'https://cdnassets.raider.io/images/login/backgrounds/bfa/blood-temple.jpg'
  }

  get title(): string {
    return `${
      this.$store.state.submission.submission &&
      this.$store.state.submission.submission.characters &&
      this.$store.state.submission.submission.characters[0].name
        ? this.$store.state.submission.submission.characters[0].name + ' Application'
        : 'Really Bad Applications'
    }`
  }

  get submission(): FormSubmission | null {
    return this.$store.state.submission.submission
  }

  get submissions(): FormSubmission[] {
    return this.$store.state.submission.submissions
  }

  get formQuestions(): Question[] {
    return this.$store.state.form.questions
  }

  get statusCategory(): string {
    return this.$store.state.submission.statusCategory
  }

  get pagination(): Pagination {
    return this.$store.state.submission.pagination
  }

  get paginationCurrent(): number {
    return this.$store.state.submission.pagination.current
  }

  set paginationCurrent(current: number) {
    this.$store.dispatch('submission/setPaginationCurrent', current)
  }

  created(): void {
    if (process.browser) {
      const wowheadScript = document.createElement('script')
      wowheadScript.setAttribute('src', 'https://wow.zamimg.com/widgets/power.js')
      document.body.appendChild(wowheadScript)
    }
  }

  changeStatus(status: string): void {
    this.$router.push(`/applications/${status}`)
  }

  defaultingTitle(submission: FormSubmission): string {
    if (submission.characters[0]) {
      return submission.characters[0].name
    } else if (submission.author.nickname) {
      return submission.author.nickname
    } else {
      return submission.author.discord_username
    }
  }

  avatar(user: User): string {
    if (user.discord_avatar) {
      const base = `https://cdn.discordapp.com/avatars/${user.discord_id}/${user.discord_avatar}`

      const avatars: Avatars = {
        webp: `${base}.webp`,
        png: `${base}.png`,
        jpg: `${base}.jpg`,
      }

      if (user.discord_avatar.startsWith('a_')) {
        avatars.gif = `${base}.gif`
      }

      return avatars.gif ? avatars.gif : avatars.png
    }

    return `https://render-us.worldofwarcraft.com/shadow/avatar/10-${Math.round(Math.random())}.jpg`
  }

  defaultingCharSubtitle(character?: FormCharacter): string {
    if (character && character.race_name && character.class_name) {
      return `${character.race_name} ${character.class_name} Application`
    }

    return `Character Missing`
  }

  classUnread(submission: FormSubmission): object {
    return {
      unread: submission.seen,
    }
  }

  defaultingClassBlur(character?: FormCharacter): object {
    const classObj = {}

    if (character && character.class_id) {
      Object.assign(classObj, {
        [`class-blur-bg-${character.class_id}`]: true,
      })
    }

    return classObj
  }

  defaultingClassBorderColor(baseClass: string, character?: FormCharacter): object {
    const classObj = {
      [baseClass]: true,
    }

    if (character && character.class_id) {
      Object.assign(classObj, {
        [`class-border-${character.class_id}`]: true,
      })
    }

    return classObj
  }

  formatDate(date: Date): string {
    try {
      return formatRelative(new Date(date), new Date())
    } catch (error) {
      console.warn(error)
      return 'Some time ago...'
    }
  }

  async onPageChange(page: number): Promise<void> {
    await this.$store.dispatch('submission/getSubmissions', {
      take: 6,
      skip: (page - 1) * 6,
      status: this.$route.params.status,
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

.category-title {
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
}
</style>
