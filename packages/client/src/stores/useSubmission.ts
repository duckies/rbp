import { defineStore } from 'pinia'
import {
  FileUpload,
  FormCharacter,
  FormSubmission,
} from '@/interfaces/entities.interface'

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

export const useSubmission = defineStore({
  id: 'submission',
  state: () => ({
    answers: {} as Answers,
    characters: [] as FormCharacter[],
    submission: null as FormSubmission | null,
    submissions: [] as FormSubmission[],
    openSubmission: null as OpenSubmission | null,
    statusCategory: SubmissionStatus.Open as SubmissionStatus,
    files: [] as FileUpload[],
    pagination: {
      page_current: 1,
      page_total: 0,
      page_size: 10,
      submission_total: 0,
    },
  }),
  getters: {
    mainCharacter: (state) => state.submission?.characters?.[0],
  },
  actions: {
    async create(formId: number) {
      const characters = this.characters.map((c) => ({
        name: c.name,
        realm: c.realm,
        region: 'us',
      }))

      this.submission = await this.$nuxt.$axios.$post('/submission', {
        formId,
        answers: this.answers,
        files: [...this.files.map((file) => file.id)],
        characters,
      })
    },
    async findOne(options: { id: number } | { status: string }) {
      const param = 'id' in options ? options.id : `status/${options.status}`

      this.submission = await this.$nuxt.$axios.$get(`/submission/${param}`)
      this.answers = this.submission!.answers
    },
    async findAll(params?: {
      limit?: number
      offset?: number
      status?: string
    }) {
      const [submissions] = await this.$nuxt.$axios.$get('/submission', {
        params,
      })
      const status = params?.status || submissions?.[0].status || 'open'

      this.submissions = submissions
      this.statusCategory = status
    },
    async findOneOpen() {
      this.openSubmission = await this.$nuxt.$axios.$get(
        '/submission/user/open'
      )
    },
    async update(id: number, status?: SubmissionStatus) {
      await this.$nuxt.$axios.$patch(`/submission/${id}`, { status })
    },
    async removeFile(id: number) {
      await this.$nuxt.$axios.$delete(`/submission/file/${id}`)
    },
  },
})
