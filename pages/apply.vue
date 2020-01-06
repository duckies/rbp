<template>
  <div>
    <hero :background="background" :title="title" :caption="caption" />

    <v-container class="hero-nudge">
      <v-row v-if="hasOpenApplication">
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
          <validation-observer v-slot="{ invalid, handleSubmit }">
            <v-form @submit.prevent="handleSubmit(submit)">
              <character-picker />
              <form-field v-for="question in questions" :key="question.id" :question="question" />
              <v-btn :loading="formLoading || submissionLoading" type="submit">
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
import { formStore, submissionStore, discordStore } from '@/store'
import Hero from '@/components/Hero.vue'
import { Question } from '@/store/form'
import FormField from '@/components/fields/FormField.vue'
import CharacterPicker from '@/components/blizzard/CharacterPicker.vue'

@Component({
  components: {
    Hero,
    ValidationObserver,
    FormField,
    CharacterPicker
  },
  async fetch(): Promise<void> {
    await Promise.all([discordStore.getDiscord(), submissionStore.getOpen(), formStore.getForm(1)])
  }
})
export default class Apply extends Vue {
  title = 'Really Bad Application'
  caption = 'Interested in joining our guild?'
  background = 'https://cdnassets.raider.io/images/login/backgrounds/bfa/froggo-loa.jpg'

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

  get openApplicationId(): number | null {
    if (!submissionStore.openSubmission || submissionStore.openSubmission.status !== 'open') return null

    return submissionStore.openSubmission.id
  }

  async submit(): Promise<void> {
    await submissionStore.create(1)

    if (submissionStore.status === 'success' && submissionStore.submission) {
      this.$router.push(`/applications/${submissionStore.submission.id}`)
    }
  }
}
</script>
