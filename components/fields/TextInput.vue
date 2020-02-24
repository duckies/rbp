<template>
  <v-text-field
    v-model="questionData"
    :hint="question.hint"
    :label="question.label"
    :required="question.required"
    :error-messages="errors"
    :readonly="readOnly"
    filled
  />
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { AnswerData } from '@/store/submission'
import { submissionStore } from '@/store'
import { Question } from '@/store/form'

@Component
export default class TextInput extends Vue {
  @Prop() readonly question!: Question
  @Prop() readonly readOnly?: boolean
  @Prop() readonly errors?: Error[]

  get questionData(): AnswerData {
    return submissionStore.answers[this.question.id]
  }

  set questionData(value) {
    submissionStore.setAnswer({
      id: this.question.id,
      value
    })
  }
}
</script>
