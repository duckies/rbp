import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import slugify from 'slugify'
import Vue from 'vue'
import { $axios } from '../utils/axios'
import { KnownCharacter } from './character'

export type AnswerData = string | string[] | boolean

export interface Answers {
  [uuid: string]: AnswerData
}

export interface FormCharacter {
  id: number
  name: string
  realm: string
  race_id?: number
  race_name?: string
  class_id?: number
  class_name?: string
  gender?: string
  avatar_url?: string
  bust_url?: string
  render_url?: string
}

export interface FormAuthor {
  id: number
  displayname?: string
  avatar?: string
  customAvatar: boolean
  battletag: string
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
  Cancelled = 'cancelled'
}

export type OpenSubmission = Pick<FormSubmission, 'id' | 'status'>

@Module({ namespaced: true, name: 'submission', stateFactory: true })
export default class SubmissionStore extends VuexModule {
  public status = 'unloaded'
  public error: Error | null = null
  public answers: Answers = {}
  public characters: KnownCharacter[] = []
  public submission: FormSubmission | null = null
  public submissions: FormSubmission[] = []
  public selectedSubmission: FormSubmission | null = null
  public openSubmission: OpenSubmission | null = null
  public totalSubmissions = 0
  public statusCategory = ''
  public pagination: Pagination = {
    current: 1,
    total: 0
  }

  @Mutation
  setStatus(data: { status: string; error?: Error }): void {
    this.status = data.status
    this.error = data.error || null
  }

  @Mutation setAnswers(answers: Answers): void {
    this.answers = Object.assign({}, answers)
  }

  @Mutation setCharacters(characters: KnownCharacter[]): void {
    this.characters = characters
  }

  @Mutation setAnswer(data: { id: string; value: string | string[] | boolean }): void {
    Vue.set(this.answers, data.id, data.value)
  }

  @Mutation setSubmission(submission: FormSubmission): void {
    this.submission = Object.assign({}, submission)
  }

  @Mutation setSubmissions(submissions: FormSubmission[]): void {
    this.submissions = submissions
  }

  @Mutation setSelectedSubmission(submission: FormSubmission | null): void {
    this.selectedSubmission = submission ? this.submissions.find(s => s.id === submission.id) || null : null
  }

  @Mutation setOpenSubmission(submission: OpenSubmission): void {
    this.openSubmission = submission
  }

  @Mutation setTotalSubmissions(count: number): void {
    this.totalSubmissions = count
    this.pagination.total = Math.ceil(count / 6)
  }

  @Mutation setPaginationCurrent(current: number): void {
    this.pagination.current = current
  }

  @Mutation setStatusCategory(status: string): void {
    this.statusCategory = status
  }

  @Action({ commit: 'setSubmission', rawError: true })
  async create(id: number): Promise<void> {
    try {
      this.context.commit('setStatus', { status: 'loading' })
      const characters = this.characters.map(c => ({
        name: c.name,
        realm: slugify(c.realm, { lower: true }),
        region: 'us'
      }))

      const data = await $axios.$post('/submission', {
        formId: id,
        answers: this.answers,
        characters
      })
      this.context.commit('setStatus', { status: 'success' })
      return data
    } catch (error) {
      this.context.commit('setStatus', { status: 'error', error })
    }
  }

  @Action({ commit: 'setSubmission', rawError: true })
  async getSubmission(params: { id?: number | string; status?: string }): Promise<FormSubmission | null> {
    const param = params.id ? params.id : `status/${params.status}`

    try {
      this.context.commit('setStatus', { status: 'loading' })
      const data = await $axios.$get(`/submission/${param}`)
      this.context.commit('form/setForm', data.form, { root: true })
      this.context.commit('setStatus', { status: 'success' })
      this.context.commit('setAnswers', data.answers)
      return data
    } catch (error) {
      this.context.commit('setStatus', { status: 'error', error })
    }

    return null
  }

  @Action({ commit: 'setSubmissions', rawError: true })
  async getSubmissions(params?: {
    take?: number
    skip?: number
    status?: string
    id?: number
  }): Promise<FormSubmission[]> {
    try {
      this.context.commit('setStatus', { status: 'loading' })
      
      const data = await $axios.$get('/submission', { params })
      const status = params && params.status ? params.status : data[0].length ? data[0][0].status : 'open'

      console.warn(data[0][0].seen)

      this.context.commit('setStatus', { status: 'success' })
      this.context.commit('setTotalSubmissions', data[1])
      this.context.commit('setStatusCategory', status)
      return data[0]
    } catch (error) {
      this.context.commit('setStatus', { status: 'error', error })
    }

    return []
  }

  // Implement answer updating at a later point.
  @Action({ rawError: true })
  async updateSubmission(data: { status?: SubmissionStatus }): Promise<void> {
    if (!this.submission && !this.submission) {
      return Promise.reject(new Error('No submission.'))
    }

    try {
      this.context.commit('setStatus', { status: 'loading' })

      await $axios.$patch(`/submission/${this.submission.id}`, { ...data })

      this.context.commit('setStatus', { status: 'success' })
    } catch (error) {
      this.context.commit('setStatus', { status: 'error', error })
    }
  }

  @Action({ commit: 'setOpenSubmission', rawError: true })
  async getOpen(): Promise<OpenSubmission | null> {
    try {
      this.context.commit('setStatus', { status: 'loading' })

      const data = await $axios.$get('/submission/user/open')
      this.context.commit('setStatus', { status: 'success' })

      return data
    } catch (error) {
      this.context.commit('setStatus', { status: 'error', error })
    }

    return null
  }
}
