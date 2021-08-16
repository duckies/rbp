<template>
  <DialogForm title="Create Raid Night" @form:submit="onSubmit">
    <template #activator="activator">
      <slot name="activator" v-bind="activator" />
    </template>

    <v-card-text>
      <DateTimePicker v-model="start" />
    </v-card-text>
  </DialogForm>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@nuxtjs/composition-api'

export default defineComponent({
  setup(_, { emit }) {
    const state = reactive({
      start: new Date(),
      end: null as Date | null,
      optional: false,
    })

    const onSubmit = () => emit('form:submit')

    return {
      ...toRefs(state),
      onSubmit,
    }
  },
})
</script>
