<template>
  <ValidationProvider v-slot="{ errors }" :rules="rules">
    <v-select
      v-model="data"
      :error-messages="errors"
      :hide-details="'hide-details' in $attrs ? $attrs['hide-details'] : 'auto'"
      :outlined="!('solo' in $attrs) && !('filled' in $attrs)"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <template
        v-for="(_, scopedSlotName) in $scopedSlots"
        #[scopedSlotName]="slotData"
      >
        <slot :name="scopedSlotName" v-bind="slotData" />
      </template>

      <template v-for="(_, slotName) in $slots" #[slotName]>
        <slot :name="slotName" />
      </template>
    </v-select>
  </ValidationProvider>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { ValidationProvider } from 'vee-validate'

export default defineComponent({
  components: {
    ValidationProvider,
  },
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Boolean, Number, Object, Array],
      required: true,
    },
    rules: {
      type: [String, Object],
      default: '',
    },
  },
  setup(props, { emit }) {
    const data = computed({
      get() {
        return props.value
      },
      set(value) {
        emit('input', value)
      },
    })

    return {
      data,
    }
  },
})
</script>
