import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { Answers } from './submission'
import { RootState } from '~/store'

export enum FieldType {
  TEXTINPUT = 'TextInput',
  TEXTAREA = 'TextArea',
  CHECKBOX = 'Checkbox',
  DIALOG = 'Dialog',
  UPLOAD = 'Upload',
}

export interface Question {
  id: string
  question: string
  label?: string
  hint?: string
  required: boolean
  choices?: string[]
  multiple?: number
  order: number
  type: FieldType
  fileTypes: string[]
  deleted: boolean
}

export interface Form {
  id: number
  name: string
  questions: Question[]
  createdOn: Date
  lastUpdated: Date
}

export const state = () => ({
  status: 'unloaded',
  error: null as Error | null,
  fields: [] as Question[],
  form: null as Form | null,
})

export type FormState = ReturnType<typeof state>

export const getters: GetterTree<FormState, RootState> = {
  isLoading: (state) => state.status === 'loading',
  questions: (state) => (state.form?.questions ? state.form.questions : []),
}

export const mutations: MutationTree<FormState> = {
  setStatus(state, data: { status: string; error: Error }) {
    state.status = data.status
    state.error = data.error || null
  },
  setForm(state, form: Form) {
    state.form = form
  },
}

export const actions: ActionTree<FormState, RootState> = {
  async getForm({ commit }, id: number) {
    try {
      commit('setStatus', { status: 'loading' })

      const resp = await this.$axios.$get('/form/' + id)

      const answers: Answers = {}
      resp.questions.forEach((q: Question) => {
        answers[q.id] = null
      })

      commit('submission/setAnswers', answers, { root: true })
      commit('setForm', resp)
      commit('setStatus', { status: 'success' })
    } catch (error) {
      commit('setStatus', { status: 'error', error })
    }
  },
}
