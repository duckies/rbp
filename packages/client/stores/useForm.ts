import { defineStore } from 'pinia';
import { Form, FormQuestion } from '@/interfaces/entities.interface';

export const useForm = defineStore({
  id: 'form',
  state: () => ({
    form: null as Form | null,
    fields: [] as FormQuestion[],
  }),
  getters: {
    questions: (state) => state.form?.questions || []
  },
  actions: {
    async findOne(id: number) {
      this.form = await this.$nuxt.$axios.$get<Form>(`/form/${id}`)
    }
  }
})