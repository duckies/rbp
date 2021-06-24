import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex'
import { Form, FormQuestion } from '../interfaces/entities.interface'
import { StateError } from '../interfaces/state/state-error.interface'
import { StateStatus } from '../interfaces/state/state-status.enum'
import { parseAxiosError } from '../utils/state.utils'
import { Answers } from './submission'

export const state = () => ({
  status: StateStatus.UNLOADED,
  error: null as StateError | null,
  fields: [] as FormQuestion[],
  form: null as Form | null,
})

export const getters = getterTree(state, {
  isLoading: (state) => state.status === StateStatus.BUSY,
  questions: (state) => state.form?.questions || ([] as FormQuestion[]),
})

export const mutations = mutationTree(state, {
  setStatus(state, status: StateStatus) {
    state.status = status

    if (status === StateStatus.BUSY) {
      state.error = null
    }
  },
  setError(state, error: any) {
    state.status = StateStatus.ERROR
    state.error = parseAxiosError(error)
  },
  setForm(state, form: Form) {
    state.form = form
  },
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async getForm({ commit }, id: number): Promise<void> {
      try {
        commit('setStatus', StateStatus.BUSY)

        const resp = await this.$axios.$get('/form/' + id)

        const answers: Answers = {}
        resp.questions.forEach((q: FormQuestion) => {
          answers[q.id] = null
        })

        this.app.$accessor.submission.setAnswers(answers)

        commit('setForm', resp)
        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
  }
)
