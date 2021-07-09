<template>
  <Hero :background="background" :title="title" :caption="caption">
    <v-row>
      <v-col>
        <v-card elevation="3">
          <v-row>
            <v-col md="8" sm="12">
              <v-card-title>Application Process</v-card-title>
              <v-card-text>
                <v-alert dismissible color="info">
                  Our site is still under construction, if you encounter any
                  issues contact Duckies#1999 on Discord. Apologies for the lack
                  of polish and any missing information.
                </v-alert>

                <p>
                  Our current recruitment goals are often posted where we
                  advertise, but anyone who thinks they have the skill or
                  determination to raid with us should apply. We only ask that
                  you fill out your application completely or it will reflect
                  poorly on you're desire to join us. After submitting your
                  application, you will be redirected to your submitted
                  application.
                </p>

                <p>
                  Currently, notification support is not available, however you
                  may check back on your application to see its status or join
                  our Discord and ask us directly. If approved, or further
                  discussion is warranted, we will contact you through Discord.
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

    <v-row v-if="!authStore.isLoggedIn">
      <v-col>
        <v-card>
          <v-card-title>Login to submit an application</v-card-title>
          <v-card-text
            >Fill out an application for our guild quickly by logging in with
            your Discord account.</v-card-text
          >
          <v-card-actions>
            <v-btn color="primary" @click="authStore.login()">
              Login with Discord
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else-if="hasOpenApplication">
      <v-col>
        <v-card>
          <v-card-title> Pending Open Application </v-card-title>

          <v-card-text>
            You may
            <nuxt-link :to="`/applications/${openApplicationId}`">
              visit your currently open application
            </nuxt-link>

            to review it, or cancel it to submit another application.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col>
        <FormValidated ref="form" @form:submit="onSubmit">
          <BlizzardCharacterPicker />

          <BlizzardCharacterPanel
            v-for="(character, i) in submissionStore.characters"
            :key="character.name + ' ' + character.realm"
            :character="character"
            :applying="true"
            :order="i"
          />

          <FormField
            v-for="question in questions"
            :key="question.id"
            :question="question"
          />

          <v-card class="mb-4">
            <v-card-title>
              Upload your UI and transmogs (Optional).
            </v-card-title>

            <v-card-subtitle>
              It's proven that a good transmog can increase performance by up to
              10%.
            </v-card-subtitle>

            <Dropzone
              id="drop"
              ref="drop"
              :options="dropOptions"
              :destroy-dropzone="true"
              @vdropzone-success="onUploadSuccess"
              @vdropzone-removed-file="handleRemoveFile"
            />
          </v-card>

          <!-- :loading="formStore.isLoading || submissionStore.isLoading" -->
          <v-btn type="submit" x-large color="primary"> Submit </v-btn>
        </FormValidated>
      </v-col>
    </v-row>
  </Hero>
</template>

<script lang="ts">
import Dropzone from 'nuxt-dropzone'
import { FileUpload } from '@/interfaces/entities.interface'
import 'nuxt-dropzone/dropzone.css'
import {
  computed,
  defineComponent,
  reactive,
  ref,
  toRefs,
  useRouter,
} from '@nuxtjs/composition-api'
import FormValidated from '@/components/form/Validated.vue'
import { useAuth, useForm, useRaids, useSubmission } from '@/stores'
import { useScriptTag } from '@vueuse/core'

export default defineComponent({
  components: {
    Dropzone,
  },
  setup() {
    const router = useRouter()
    const formStore = useForm()
    const authStore = useAuth()
    const submissionStore = useSubmission()

    const form = ref<InstanceType<typeof FormValidated>>()

    const state = reactive({
      files: [],
      shouldntRemove: false,
    })

    const questions = computed(() => formStore.questions)

    const dropOptions = computed(() => ({
      url: process.env.FRONTEND_FILE_UPLOAD_URL,
      addRemoveLinks: true,
      maxFiles: 5,
      headers: { Authorization: `Bearer ${authStore.token}` },
      duplicateCheck: true,
    }))

    const onUploadSuccess = (_file: unknown, _response: FileUpload[]) => {
      // this.$store.commit('submission/addFile', response[0])
    }

    // TODO: This package is poorly typed, need to make custom types.
    const handleRemoveFile = (file: any) => {
      if (!state.shouldntRemove && file?.xhr.responseText) {
        const response = JSON.parse(file.xhr.responseText)

        if (Array.isArray(response) && response[0]?.id) {
          // TODO: I think this had other parts, but I hate the design.
          submissionStore.removeFile(response[0])
        }
      }
    }

    const hasOpenApplication = computed(() => !!openApplicationId.value)

    const openApplicationId = computed(() => {
      if (!submissionStore.openSubmission) return null

      if (submissionStore.openSubmission.status === 'open') return null

      return submissionStore.openSubmission.id
    })

    const onSubmit = async () => {
      state.shouldntRemove = true

      if (!submissionStore.submission?.characters.length) {
        return form.value?.observer?.setErrors({
          picker: 'You must select at least one main character.',
        })
      }

      try {
        await submissionStore.create(1)
      } catch (error) {
        if (submissionStore.submission) {
          router.push(`/applications/${submissionStore.submission.id}`)
        }
      }
    }

    useScriptTag('https://wow.zamimg.com/widgets/power.js')

    return {
      title: 'Really Bad Application',
      caption: 'Interested in joining our guild?',
      background: '/images/backgrounds/bastion.jpg',
      ...toRefs(state),
      dropOptions,
      form,
      authStore,
      formStore,
      questions,
      submissionStore,
      onUploadSuccess,
      handleRemoveFile,
      openApplicationId,
      hasOpenApplication,
      onSubmit,
    }
  },
  fetch: async ({ $pinia }) => {
    const authStore = useAuth($pinia)
    const formStore = useForm($pinia)
    const raidStore = useRaids($pinia)
    const submissionStore = useSubmission($pinia)

    const promises: Array<Promise<any>> = [formStore.findOne(1)]

    if (authStore.isLoggedIn) {
      promises.push(submissionStore.findOneOpen())
    }

    if (raidStore.raids.length === 0) {
      promises.push(raidStore.findFeatured())
    }

    await Promise.all(promises)
  },
})
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
