<template>
  <div>
    <v-checkbox
      v-for="(choice, i) in question.choices"
      :key="i"
      v-model="data"
      :hint="question.hint"
      :required="question.required"
      :label="choice"
      :multiple="question.multiple ? question.multiple : false"
      :value="
        question.choices && question.choices.length > 1 ? choice : undefined
      "
      filled
    />
  </div>
</template>

<script lang="ts">
import { useSubmission } from '@client/stores'
import { defineComponent, set } from '@nuxtjs/composition-api'
import { computed, PropType } from 'vue-demi'
import { FormQuestion } from '@/interfaces/entities.interface'

export default defineComponent({
  props: {
    question: {
      type: Object as PropType<FormQuestion>,
      required: true,
    },
  },
  setup(props) {
    const submissionStore = useSubmission()

    const data = computed({
      get() {
        return submissionStore.answers[props.question.id]
      },
      set(value) {
        set(submissionStore.answers, props.question.id, value)
      },
    })

    return {
      data,
    }
  },
})
</script>
