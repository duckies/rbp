import { ActionTree, GetterTree, MutationTree } from 'vuex'
import Vue from 'vue'

import { CharacterRaiderIO } from '../interfaces/raiderIO/character.interface'
import { FormCharacter } from './roster'
import { User } from './user'
import { RootState } from '.'

export type AnswerData = string | string[] | boolean | null

export interface Answers {
  [uuid: string]: AnswerData
}

export interface FormAuthor {
  id: number
  nickname?: string
  discord_id: string
  discord_avatar: string
  discord_username: string
  discord_discriminator: string
}

export interface FormSubmission {
  id: number
  status: string
  createdAt: Date
  formId: number
  characters: FormCharacter[]
  author: FormAuthor
  seen?: boolean
}

export interface Pagination {
  current: number
  total: number
}

export enum SubmissionStatus {
  Open = 'open',
  Approved = 'approved',
  Rejected = 'rejected',
  Cancelled = 'cancelled',
}
export type OpenSubmission = Pick<FormSubmission, 'id' | 'status'>

export interface FormCharacterIdentity {
  name: string
  realm: string
  realm_name: string
  region: string
  blizzard?: Omit<FormCharacter, 'raiderIO'>
  raiderIO?: CharacterRaiderIO
}

export interface FileUpload {
  id: number
  filename: string
  mimetype: string
  path: string
  sizE: number
  author: User
  immune: boolean
}

export const state = () => ({
  status: 'unloaded',
  error: null as Error | null,
  answers: {} as Answers,
  characters: [] as FormCharacterIdentity[],
  submission: null as FormSubmission | null,
  submissions: [] as FormSubmission[],
  selectedSubmission: null as FormSubmission | null,
  openSubmission: null as OpenSubmission | null,
  totalSubmissions: 0,
  statusCategory: SubmissionStatus.Open as SubmissionStatus,
  files: [] as FileUpload[],
  pagination: {
    current: 1,
    total: 0,
  } as Pagination,
})

export type SubmissionState = ReturnType<typeof state>

export const getters: GetterTree<SubmissionState, RootState> = {
  isLoading: (state) => state.status === 'loading',
  mainCharacter: (state) => (state?.submission?.characters.length ? state.submission.characters[0] : undefined),
}

export const mutations: MutationTree<SubmissionState> = {
  setStatus(state, data: { status: string; error: Error }) {
    state.status = data.status
    state.error = data.error || null
  },
  setAnswers(state, answers: Answers) {
    state.answers = Object.assign({}, answers)
  },
  setAnswer(state, data: { id: string; value: string | string[] | boolean | null }) {
    Vue.set(state.answers, data.id, data.value)
  },
  setCharacters(state, characters: FormCharacterIdentity[]) {
    state.characters = characters
  },
  addCharacter(state, character: FormCharacterIdentity) {
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
    state.totalSubmissions = count
    state.pagination.total = Math.ceil(count / 6)
  },
  setPaginationCurrent(state, current: number) {
    state.pagination.current = current
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
}

export const actions: ActionTree<SubmissionState, RootState> = {
  async createSubmission({ commit, state }, formId: number) {
    try {
      commit('setStatus', { status: 'loading' })

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

      commit('setStatus', { status: 'success' })
      commit('setSubmission', resp)
    } catch (error) {
      commit('setStatus', { status: 'error', error })
    }
  },
  async getSubmission({ commit }, params: { id?: number | string; status?: string }) {
    const param = params.id ? params.id : `status/${params.status}`

    try {
      commit('setStatus', { status: 'loading' })

      const resp = await this.$axios.$get(`/submission/${param}`)

      commit('setSubmission', resp)
      commit('setAnswers', resp.answers)
      commit('form/setForm', resp.form, { root: true })
      commit('setStatus', { status: 'success' })
    } catch (error) {
      commit('setStatus', { status: 'error', error })
    }
  },
  async updateSubmission({ commit, state }, data: { status?: SubmissionStatus }) {
    if (!state.submission) {
      return Promise.reject(new Error('No submission to update.'))
    }

    try {
      commit('setStatus', { status: 'loading' })

      await this.$axios.$patch(`/submission/${state.submission.id}`, { ...data })

      commit('setStatus', { status: 'success' })
    } catch (error) {
      commit('setStatus', { status: 'error', error })
    }
  },
  async getSubmissions(
    { commit },
    params?: {
      take?: number
      skip?: number
      status?: string
    }
  ) {
    try {
      commit('setStatus', { status: 'loading' })

      const resp = await this.$axios.$get('/submission', { params })
      const status = params && params.status ? params.status : resp[0].length ? resp[0][0].status : 'open'

      commit('setTotalSubmissions', resp[1])
      commit('setStatusCategory', status)
      commit('setSubmissions', resp[0])

      commit('setStatus', { status: 'success' })
    } catch (error) {
      commit('setStatus', { status: 'error', error })
    }
  },
  async getUserOpenSubmission({ commit }) {
    try {
      commit('setStatus', { status: 'loading' })

      const resp = await this.$axios.$get('/submission/user/open')

      commit('setStatus', { status: 'success' })
      commit('setOpenSubmission', resp)
    } catch (error) {
      commit('setStatus', { status: 'error', error })
    }
  },
  async removeFile({ commit }, id: number) {
    try {
      commit('setStatus', { status: 'loading' })

      await this.$axios.$delete('/submission/file/' + id)

      commit('setStatus', { status: 'success' })
    } catch (error) {
      commit('setStatus', { status: 'error', error })
    }
  },
}
