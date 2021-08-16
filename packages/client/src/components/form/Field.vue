<template>
  <v-card class="mb-4">
    <v-card-title class="question-title">{{ question.question }}</v-card-title>

    <v-card-text>
      <template v-if="readOnly">
        <FormResponse v-model="data" />
      </template>

      <template v-else>
        <Component
          :is="question.type"
          v-model="data"
          :rules="rules"
          :hint="question.hint"
          :label="question.label"
          :required="question.required"
        />
      </template>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { useSubmission } from '@/stores'
import {
  computed,
  defineComponent,
  PropType,
  set,
} from '@nuxtjs/composition-api'
import TextInput from '@/components/inputs/TextField.vue'
import TextArea from '@/components/inputs/TextArea.vue'
import Checkbox from '@/components/form/Checkbox.vue'
import Select from '@/components/form/Select.vue'
import { FormQuestion } from '~/interfaces/entities.interface'

export interface QuestionRules {
  required: boolean
}

export default defineComponent({
  components: {
    TextArea,
    TextInput,
    Checkbox,
    Select,
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
      data,
      rules,
    }
  },
})
</script>

<style scoped>
.question-title {
  word-break: break-word;
}
</style>
