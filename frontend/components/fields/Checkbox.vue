<template>
  <div>
    <v-checkbox
      v-for="(choice, i) in question.choices"
      :key="i"
      v-model="questionData"
      :hint="question.hint"
      :required="question.required"
      :label="choice"
      :multiple="question.multiple ? question.multiple : false"
      :value="question.choices.length > 1 ? choice : undefined"
      filled
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { FormQuestion } from '../../interfaces/entities.interface'

@Component
export default class Checkbox extends Vue {
  @Prop({ required: true }) question!: FormQuestion

  get questionData() {
    return this.$accessor.submission.answers[this.question.id]
  }

  set questionData(value) {
    this.$store.commit('submission/setAnswer', {
      id: this.question.id,
      value,
    })
  }
}
</script>
