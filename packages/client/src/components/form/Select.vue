<template>
  <v-select
    v-if="!readOnly"
    v-model="data"
    :hint="question.hint"
    :label="question.label"
    :required="question.required"
    :items="question.choices"
    :error-messages="errors"
    :readonly="readOnly"
    filled
  />
  <FormResponse v-else :text="data" />
</template>

<script lang="ts">
import { useSubmission } from '@client/stores'
import {
  computed,
  defineComponent,
  PropType,
  set,
} from '@nuxtjs/composition-api'
import FormResponse from '@/components/form/Response.vue'
import { FormQuestion } from '~/interfaces/entities.interface'

export default defineComponent({
  components: {
    FormResponse,
  },
  props: {
    question: {
      type: Object as PropType<FormQuestion>,
      required: true,
    },
    readOnly: {
      type: Boolean,
      required: false,
    },
    errors: {
      type: Array as PropType<Error[]>,
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

    return { data }
  },
})
</script>
