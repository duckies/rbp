<template>
  <v-textarea
    v-if="!readOnly"
    v-model="questionData"
    :hint="question.hint"
    :label="question.label"
    :required="question.required"
    :error-messages="errors"
    filled
  />
  <form-response v-else :text="questionData" />
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import FormResponse from '~/components/fields/FormResponse.vue'
import { FormQuestion } from '~/interfaces/entities.interface'
import { AnswerData } from '~/store/submission'

@Component({
  components: {
    FormResponse,
  },
})
export default class TextArea extends Vue {
  @Prop() readonly question!: FormQuestion
  @Prop() readonly readOnly?: boolean
  @Prop() readonly errors?: Error[]

  get questionData(): AnswerData {
    return this.$store.state.submission.answers[this.question.id]
  }

  set questionData(value) {
    this.$store.commit('submission/setAnswer', {
      id: this.question.id,
      value,
    })
  }
}
</script>

<style scoped>
.question-text {
  word-break: break-word;
}
</style>
