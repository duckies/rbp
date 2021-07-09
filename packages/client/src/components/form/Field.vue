<template>
  <v-card class="mb-4">
    <v-card-title class="question-title">{{ question.question }}</v-card-title>

    <v-card-text>
      <ValidationProvider v-slot="{ errors }" :rules="rules">
        <Component
          :is="question.type"
          v-model="data"
          :errors="errors"
          :question="question"
          :read-only="readOnly"
        />
      </ValidationProvider>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { useSubmission } from '@/stores'
import { ValidationProvider } from 'vee-validate'
import {
  computed,
  defineComponent,
  PropType,
  set,
} from '@nuxtjs/composition-api'
import TextInput from '@/components/form/TextInput.vue'
import TextArea from '@/components/form/TextArea.vue'
import Checkbox from '@/components/form/Checkbox.vue'
import Select from '@/components/form/Select.vue'
import { FormQuestion } from '~/interfaces/entities.interface'

export interface QuestionRules {
  required: boolean
}

export default defineComponent({
  components: { TextArea, TextInput, Checkbox, Select, ValidationProvider },
  props: {
    question: {
      type: Object as PropType<FormQuestion>,
      required: true,
    },
    readOnly: {
      type: Boolean,
      required: false,
    },
  },
  setup(props) {
    const submissionStore = useSubmission()

    const rules = computed(() => ({ required: props.question.required }))

    const data = computed({
      get() {
        return submissionStore.answers[props.question.id]
      },
      set(value) {
        if (props.readOnly) return

        set(submissionStore.answers, props.question.id, value)
      },
    })

    return {
      rules,
      data,
    }
  },
})
</script>

<style scoped>
.question-title {
  word-break: break-word;
}
</style>
