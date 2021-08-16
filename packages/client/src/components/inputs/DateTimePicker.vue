<template>
  <v-row>
    <v-col>
      <v-menu
        v-model="dateMenu"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template #activator="{ on, attrs }">
          <TextField
            v-model="date"
            :label="dateLabel"
            readonly
            v-bind="attrs"
            v-on="on"
          />
        </template>

        <v-date-picker v-model="date" @input="dateMenu = false" />
      </v-menu>
    </v-col>

    <v-col>
      <v-dialog
        v-model="timeDialog"
        transition="scale-transition"
        max-width="auto"
      >
        <template #activator="{ on, attrs }">
          <TextField
            :value="format(value, 'p')"
            :label="timeLabel"
            readonly
            v-bind="attrs"
            v-on="on"
          />
        </template>

        <v-time-picker v-if="timeDialog" v-model="time" full-width />
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import { format } from 'date-fns'
import { getDateComponents, toDateFromLocalISO } from '../../utils/time'

export default defineComponent({
  props: {
    value: {
      type: Date,
      default: () => new Date(),
    },
    dateLabel: {
      type: String,
      default: 'Date',
    },
    timeLabel: {
      type: String,
      default: 'Time',
    },
  },
  setup(props, { emit }) {
    const dateMenu = ref(false)
    const timeDialog = ref(false)

    const date = computed({
      get() {
        const { year, month, date } = getDateComponents(props.value)

        return `${year}-${month}-${date}`
      },
      set(value: string) {
        emit('input', toDateFromLocalISO(value, time.value))
      },
    })

    const time = computed({
      get() {
        const { hours, minutes } = getDateComponents(props.value)

        return `${hours}:${minutes}`
      },
      set(value: string) {
        emit('input', toDateFromLocalISO(date.value, value))
      },
    })

    return {
      date,
      dateMenu,
      time,
      timeDialog,
      format,
    }
  },
})
</script>
