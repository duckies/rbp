<template>
  <v-card class="mb-4">
    <v-card-title>{{ question.question }}</v-card-title>

    <v-card-text>
      <validation-provider v-slot="{ errors }" :rules="rules">
        <component
          :is="question.type"
          v-model="questionData"
          :errors="errors"
          :question="question"
          :read-only="readOnly"
        />
      </validation-provider>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { ValidationProvider } from 'vee-validate'
import TextArea from '@/components/fields/TextArea.vue'
import Checkbox from '@/components/fields/Checkbox.vue'
import Select from '@/components/fields/Select.vue'
import { Question } from '@/store/form'
import { AnswerData } from '@/store/submission'
import { submissionStore } from '@/store'

export interface QuestionRules {
  required: boolean
}

@Component({
  components: { TextArea, Checkbox, Select, ValidationProvider }
})
export default class FormField extends Vue {
  @Prop() readonly question!: Question
  @Prop() readonly readOnly?: boolean

  get rules(): QuestionRules {
    return {
      required: this.question.required
    }
  }

  get questionData(): AnswerData {
    return submissionStore.answers[this.question.id]
  }

  set questionData(value: AnswerData) {
    if (this.readOnly) return
    submissionStore.setAnswer({ id: this.question.id, value })
  }
}
</script>
