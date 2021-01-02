import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex'
import Vue from 'vue'
import { FileUpload, FormCharacter, FormSubmission } from '../interfaces/entities.interface'
import { StateError } from '../interfaces/state/state-error.interface'
import { StateStatus } from '../interfaces/state/state-status.enum'
import { parseAxiosError } from '../utils/state.utils'

export type AnswerData = string | string[] | boolean | null

export interface Answers {
  [uuid: string]: AnswerData
}

export enum SubmissionStatus {
  Open = 'open',
  Approved = 'approved',
  Rejected = 'rejected',
  Cancelled = 'cancelled',
}
export type OpenSubmission = Pick<FormSubmission, 'id' | 'status'>

export const state = () => ({
  status: StateStatus.UNLOADED,
  error: null as StateError | null,
  answers: {} as Answers,
  characters: [] as FormCharacter[],
  submission: null as FormSubmission | null,
  submissions: [] as FormSubmission[],
  selectedSubmission: null as FormSubmission | null,
  openSubmission: null as OpenSubmission | null,
  statusCategory: SubmissionStatus.Open as SubmissionStatus,
  files: [] as FileUpload[],
  pagination: {
    page_current: 1,
    page_total: 0,
    page_size: 10,
    submission_total: 0,
  },
})

export type SubmissionState = ReturnType<typeof state>

export const getters = getterTree(state, {
  isLoading: (state) => state.status === StateStatus.BUSY,
  mainCharacter: (state) => state.submission?.characters?.[0],
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
  setAnswers(state, answers: Answers) {
    state.answers = Object.assign({}, answers)
  },
  setAnswer(state, data: { id: string; value: string | string[] | boolean | null }) {
    Vue.set(state.answers, data.id, data.value)
  },
  setCharacters(state, characters: FormCharacter[]) {
    state.characters = characters
  },
  addCharacter(state, character: FormCharacter) {
    state.characters.push(character)
  },
  setSubmission(state, submission: FormSubmission) {
    state.submission = Object.assign({}, submission)
  },
  setSubmissions(state, submissions: FormSubmission[]) {
    state.submissions = submissions
  },
  setSelectedSubmission(state, submission: FormSubmission | null) {
    state.selectedSubmission = submission ? state.submissions.find((s) => s.id === submission.id) || null : null
  },
  setOpenSubmission(state, submission: FormSubmission) {
    state.openSubmission = submission
  },
  setTotalSubmissions(state, count: number) {
    state.pagination.submission_total = count
    state.pagination.page_total = Math.ceil(count / state.pagination.page_size)
  },
  setPaginationCurrent(state, current: number) {
    state.pagination.page_current = current
  },
  setStatusCategory(state, status: SubmissionStatus) {
    state.statusCategory = status
  },
  setMainCharacter(state, index: number) {
    state.characters.unshift(state.characters.splice(index, 1)[0])
  },
  removeCharacter(state, index: number) {
    state.characters.splice(index, 1)
  },
  addFile(state, file: FileUpload) {
    state.files.push(file)
  },
  removeFile(state, file: FileUpload) {
    const index = state.files.findIndex((f) => f.id === file.id)

    if (index !== -1) state.files.splice(index, 1)
  },
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async createSubmission({ commit, state }, formId: number): Promise<void> {
      try {
        commit('setStatus', StateStatus.BUSY)

        const characters = state.characters.map((c) => ({
          name: c.name,
          realm: c.realm,
          region: 'us',
        }))

        const resp = await this.$axios.$post('/submission', {
          formId,
          answers: state.answers,
          files: [...state.files.map((file) => file.id)],
          characters,
        })

        commit('setSubmission', resp)
        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async getSubmission({ commit }, params: { id?: number | string; status?: string }): Promise<void> {
      const param = params.id ? params.id : `status/${params.status}`

      try {
        commit('setStatus', StateStatus.BUSY)

        const resp = await this.$axios.$get(`/submission/${param}`)

        commit('setSubmission', resp)
        commit('setAnswers', resp.answers)
        this.app.$accessor.form.setForm(resp.form)

        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async updateSubmission({ commit, state }, data: { status?: SubmissionStatus }): Promise<void> {
      if (!state.submission) {
        return Promise.reject(new Error('No submission to update.'))
      }

      try {
        commit('setStatus', StateStatus.BUSY)

        await this.$axios.$patch(`/submission/${state.submission.id}`, { ...data })

        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async getSubmissions(
      { commit },
      params?: {
        limit?: number
        offset?: number
        status?: string
      }
    ): Promise<void> {
      try {
        commit('setStatus', StateStatus.BUSY)

        const resp = await this.$axios.$get('/submission', { params })
        const status = params && params.status ? params.status : resp[0].length ? resp[0][0].status : 'open'

        commit('setTotalSubmissions', resp[1])
        commit('setStatusCategory', status)
        commit('setSubmissions', resp[0])

        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
    async getUserOpenSubmission({ commit }): Promise<void> {
      try {
        commit('setStatus', StateStatus.BUSY)

        const resp = await this.$axios.$get('/submission/user/open')

        commit('setStatus', StateStatus.WAITING)
        commit('setOpenSubmission', resp)
      } catch (error) {
        commit('setError', error)
      }
    },
    async removeFile({ commit }, id: number): Promise<void> {
      try {
        commit('setStatus', StateStatus.BUSY)

        await this.$axios.$delete('/submission/file/' + id)

        commit('setStatus', StateStatus.WAITING)
      } catch (error) {
        commit('setError', error)
      }
    },
  }
)
