<template>
  <div>
    <hero :background="background" :title="title" :caption="caption" />

    <v-container class="hero-nudge">
      <v-row>
        <v-col>
          <v-card elevation="3">
            <v-row>
              <v-col md="8" sm="12">
                <v-card-title>Application Process</v-card-title>
                <v-card-text>
                  <v-alert dismissible color="info">
                    Our site is still under construction, if you encounter any issues contact Duckies#1999 on Discord.
                    Apologies for the lack of polish and any missing information.
                  </v-alert>
                  <p>
                    Our current recruitment goals are often posted where we advertise, but anyone who thinks they have
                    the skill or determination to raid with us should apply. We only ask that you fill out your
                    application completely or it will reflect poorly on you're desire to join us. After submitting your
                    application, you will be redirected to your submitted application.
                  </p>
                  <p>
                    Currently, notification support is not available, however you may check back on your application to
                    see its status or join our Discord and ask us directly. If approved, or further discussion is
                    warranted, we will contact you through Discord.
                  </p>
                </v-card-text>
              </v-col>
              <v-col>
                <v-card-title>Raiding Information</v-card-title>
                <v-card-text>
                  <ul>
                    <li>Raids Sunday & Monday 7:00 to 11:00 PM PST</li>
                    <li>Discord Voice Communication</li>
                    <li>Loot Council</li>
                    <li>At least 90% attendance requirement.</li>
                  </ul>
                </v-card-text>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-row v-if="!loggedIn">
        <v-col>
          <v-card>
            <v-card-title>Login to submit an application</v-card-title>
            <v-card-text
              >Fill out an application for our guild quickly by logging in with your Discord account.</v-card-text
            >
            <v-card-actions>
              <v-btn color="primary" @click="$auth.login()">Login with Discord</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- <v-row v-else-if="hasOpenApplication">
        <v-col>
          <v-card>
            <v-card-title>
              Pending Open Application
            </v-card-title>

            <v-card-text>
              You may
              <nuxt-link :to="`/applications/${openApplicationId}`">visit your currently open application</nuxt-link>
              to review it, or cancel it to submit another application.
            </v-card-text>
          </v-card>
        </v-col>
      </v-row> -->

      <v-row v-else>
        <v-col>
          <validation-observer ref="form" v-slot="{ invalid, handleSubmit }">
            <v-form @submit.prevent="handleSubmit(submit)">
              <character-picker />
              <character-panel
                v-for="(character, i) in characters"
                :key="character.name + ' ' + character.realm"
                :name="character.name"
                :realm="character.realm"
                :realm-name="character.realm_name"
                :region="character.region"
                :blizzard="character.blizzard"
                :raider-i-o="character.raiderIO"
                :applying="true"
                :order="i"
              />
              <form-field v-for="question in questions" :key="question.id" :question="question" />

              <dropzone
                id="drop"
                ref="drop"
                :options="dropOptions"
                :destroy-dropzone="true"
                @vdropzone-success="uploadSuccess"
              />

              <v-btn :loading="formLoading || submissionLoading" type="submit" x-large color="primary">
                Submit
              </v-btn>
            </v-form>
          </validation-observer>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { ValidationObserver } from 'vee-validate'
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import Dropzone from 'nuxt-dropzone'
import 'nuxt-dropzone/dropzone.css'
import { formStore, submissionStore, discordStore, userStore, raidStore } from '@/store'
import Hero from '@/components/Hero.vue'
import { Question } from '@/store/form'
import FormField from '@/components/fields/FormField.vue'
import CharacterPanel from '@/components/blizzard/CharacterPanel.vue'
import CharacterPicker from '@/components/blizzard/CharacterPicker.vue'
import { FormCharacterIdentity, FileUpload } from '@/store/submission'

@Component({
  components: {
    Hero,
    ValidationObserver,
    FormField,
    CharacterPicker,
    CharacterPanel,
    Dropzone
  },
  async fetch(): Promise<void> {
    const promises: Promise<unknown>[] = [discordStore.getDiscord(), formStore.getForm(1)]

    if (userStore.loggedIn) {
      promises.push(submissionStore.getOpen())
    }

    if (!raidStore.raids || !raidStore.raids.length) {
      promises.push(raidStore.getRaids())
    }

    await Promise.all(promises)
  }
})
export default class Apply extends Vue {
  title = 'Really Bad Application'
  caption = 'Interested in joining our guild?'
  background = '/images/backgrounds/bastion.jpg'
  files = []
  dropOptions = {
    whatever: process.env.FRONTEND_BASE_URL,
    url: process.env.fileUploadURL,
    maxFiles: 5,
    headers: { Authorization: `Bearer ${this.$storage.getCookie('token')}` },
    duplicateCheck: true
  }

  $refs!: {
    form: InstanceType<typeof ValidationObserver>
  }

  get loggedIn(): boolean {
    return userStore.loggedIn
  }

  get formLoading(): boolean {
    return formStore.status === 'loading'
  }

  get submissionLoading(): boolean {
    return submissionStore.status === 'loading'
  }

  get questions(): Question[] {
    return formStore.questions
  }

  get hasOpenApplication(): boolean {
    return !!this.openApplicationId
  }

  get characters(): FormCharacterIdentity[] {
    return submissionStore.characters
  }

  get openApplicationId(): number | null {
    if (!submissionStore.openSubmission || submissionStore.openSubmission.status !== 'open') return null

    return submissionStore.openSubmission.id
  }

  created(): void {
    if (process.browser) {
      const wowheadScript = document.createElement('script')
      wowheadScript.setAttribute('src', 'https://wow.zamimg.com/widgets/power.js')
      document.body.appendChild(wowheadScript)
    }
  }

  uploadSuccess(file: unknown, response: FileUpload[]): void {
    submissionStore.setFiles(response)
  }

  async submit(): Promise<void> {
    if (!this.characters.length) {
      return this.$refs.form.setErrors({
        realm: 'You must select at least one main character.'
      })
    }
    await submissionStore.create(1)

    if (submissionStore.status === 'success' && submissionStore.submission) {
      this.$router.push(`/applications/${submissionStore.submission.id}`)
    }
  }
}
</script>
