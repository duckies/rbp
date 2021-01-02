<template>
  <v-card class="mb-4">
    <v-card-title class="question-title">{{ question.question }}</v-card-title>

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
import TextInput from '~/components/fields/TextInput.vue'
import TextArea from '~/components/fields/TextArea.vue'
import Checkbox from '~/components/fields/Checkbox.vue'
import Select from '~/components/fields/Select.vue'
import { AnswerData } from '~/store/submission'
import { FormQuestion } from '~/interfaces/entities.interface'

export interface QuestionRules {
  required: boolean
}

@Component({
  components: { TextArea, TextInput, Checkbox, Select, ValidationProvider },
})
export default class FormField extends Vue {
  @Prop() readonly question!: FormQuestion
  @Prop() readonly readOnly?: boolean

  get rules(): QuestionRules {
    return {
      required: this.question.required,
    }
  }

  get questionData(): AnswerData {
    return this.$store.state.submission.answers[this.question.id]
  }

  set questionData(value: AnswerData) {
    if (this.readOnly) return
    this.$store.commit('submission/setAnswer', { id: this.question.id, value })
  }
}
</script>

<style scoped>
.question-title {
  word-break: break-word;
}
</style>
