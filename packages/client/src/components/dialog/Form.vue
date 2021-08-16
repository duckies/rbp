<template>
  <v-dialog v-model="dialog" :max-width="maxWidth">
    <template #activator="activator">
      <slot name="activator" v-bind="activator" />
    </template>

    <v-card>
      <v-toolbar flat>
        <v-card-title v-text="title" />

        <v-spacer />

        <v-btn icon @click="dialog = !dialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <FormValidated @form:submit="onSubmit">
        <slot />
      </FormValidated>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    maxWidth: {
      type: [Number, String],
      default: 500,
    },
  },
  setup(_, { emit }) {
    const dialog = ref(false)

    const onSubmit = () => emit('form:submit')

    return {
      dialog,
      onSubmit,
    }
  },
})
</script>
