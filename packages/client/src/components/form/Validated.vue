<template>
  <ValidationObserver ref="observer" v-slot="attrs">
    <v-form @submit.prevent="attrs.passes(onSubmit)">
      <slot v-bind="attrs" />
    </v-form>
  </ValidationObserver>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
import { ValidationObserver } from 'vee-validate'

export default defineComponent({
  components: {
    ValidationObserver,
  },
  setup(_, { emit }) {
    const observer = ref<InstanceType<typeof ValidationObserver>>()

    const onSubmit = () => emit('form:submit')

    const resetValidation = () => observer.value!.reset()

    return {
      observer,
      onSubmit,
      resetValidation,
    }
  },
})
</script>
