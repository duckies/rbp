<template>
  <v-card>
    <v-card-title>Slides</v-card-title>

    <v-data-table :items="slideStore.slides" :headers="headers">
      <template #[`item.image`]="{ item }">
        <v-avatar size="35px" class="mr-2">
          <v-img :src="item.image" />
        </v-avatar>

        <span>{{ item.image }}</span>
      </template>

      <template #[`item.edit`]="{ item }">
        <v-btn icon>
          <v-icon>mdi-image-edit-outline</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import { useSlides } from '@client/stores'
import { defineComponent, useFetch } from '@nuxtjs/composition-api'

export default defineComponent({
  layout: 'admin',
  setup() {
    const slideStore = useSlides()

    useFetch(async () => await slideStore.findAll())

    return {
      slideStore,
      headers: [
        {
          text: 'Id',
          value: 'id',
        },
        {
          text: 'Title',
          value: 'title',
        },
        {
          text: 'Subtitle',
          value: 'subtitle',
        },
        {
          text: 'Image',
          value: 'image',
        },
        {
          text: 'Edit',
          value: 'edit',
        },
      ],
    }
  },
})
</script>
