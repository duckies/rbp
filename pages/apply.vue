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

      <v-row v-if="!$store.getters['user/isLoggedIn']">
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

      <v-row v-else-if="hasOpenApplication">
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
      </v-row>

      <v-row v-else>
        <v-col>
          <validation-observer ref="form" v-slot="{ invalid, handleSubmit }">
            <v-form @submit.prevent="handleSubmit(submit)">
              <character-picker />
              <character-panel
                v-for="(character, i) in $store.state.submission.characters"
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
              <form-field
                v-for="question in $store.getters['form/questions']"
                :key="question.id"
                :question="question"
              />

              <v-card class="mb-4">
                <v-card-title>Upload your UI and transmogs (Optional).</v-card-title>
                <v-card-subtitle
                  >It's proven that a good transmog can increase performance by up to 10%.</v-card-subtitle
                >
                <dropzone
                  id="drop"
                  ref="drop"
                  :options="dropOptions"
                  :destroy-dropzone="true"
                  @vdropzone-success="uploadSuccess"
                  @vdropzone-removed-file="removeFile"
                />
              </v-card>

              <v-btn
                :loading="$store.state.form.isLoading || $store.state.submission.isLoading"
                type="submit"
                x-large
                color="primary"
              >
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
import Hero from '~/components/Hero.vue'
import FormField from '~/components/fields/FormField.vue'
import CharacterPanel from '~/components/blizzard/CharacterPanel.vue'
import CharacterPicker from '~/components/blizzard/CharacterPicker.vue'
import { FileUpload } from '~/store/submission'

@Component({
  components: {
    Hero,
    ValidationObserver,
    FormField,
    CharacterPicker,
    CharacterPanel,
    Dropzone,
  },
  async fetch({ store }): Promise<void> {
    const promises: Promise<unknown>[] = [store.dispatch('form/getForm', 1)]

    if (store.getters['user/isLoggedIn']) {
      promises.push(store.dispatch('submission/getUserOpenSubmission'))
    }

    if (!store.state.raid?.raids.length) {
      promises.push(store.dispatch('raid/getRaids'))
    }

    await Promise.all(promises)
  },
})
export default class Apply extends Vue {
  title = 'Really Bad Application'
  caption = 'Interested in joining our guild?'
  background = '/images/backgrounds/bastion.jpg'
  files = []
  shouldntRemove = false
  dropOptions = {
    url: process.env.FRONTEND_FILE_UPLOAD_URL,
    addRemoveLinks: true,
    maxFiles: 5,
    headers: { Authorization: `Bearer ${this.$store.state.user.token}` },
    duplicateCheck: true,
  }

  $refs!: {
    form: InstanceType<typeof ValidationObserver>
  }

  get hasOpenApplication(): boolean {
    return !!this.openApplicationId
  }

  get openApplicationId(): number | null {
    if (!this.$store.state.submission.openSubmission || this.$store.state.submission.openSubmission.status !== 'open')
      return null

    return this.$store.state.submission.openSubmission.id
  }

  created(): void {
    if (process.browser) {
      const wowheadScript = document.createElement('script')
      wowheadScript.setAttribute('src', 'https://wow.zamimg.com/widgets/power.js')
      document.body.appendChild(wowheadScript)
    }
  }

  uploadSuccess(file: unknown, response: FileUpload[]): void {
    this.$store.commit('submission/addFile', response[0])
  }

  // TODO: This package is poorly typed, need to make custom types.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeFile(file: any) {
    if (!this.shouldntRemove && file.xhr && file.xhr.responseText) {
      const response = JSON.parse(file.xhr.responseText)

      if (Array.isArray(response) && response[0]?.id) {
        this.$store.commit('submission/removeFile', response[0])
        this.$store.dispatch('submission/removeFile', response[0]?.id)
      }
    }
  }

  async submit(): Promise<void> {
    this.shouldntRemove = true

    if (!this.$store.state.submission.characters.length) {
      return this.$refs.form.setErrors({
        realm: 'You must select at least one main character.',
      })
    }
    await this.$store.dispatch('submission/createSubmission', 1)

    if (this.$store.state.submission.status === 'success' && this.$store.state.submission.submission) {
      this.$router.push(`/applications/${this.$store.state.submission.submission.id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.vue-dropzone {
  border: 0;
  background: inherit;

  &:hover {
    background-color: lighten(#1d1e22, 5%);
  }
}
</style>
