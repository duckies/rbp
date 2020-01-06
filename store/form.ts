import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { $axios } from '../utils/axios'
import { AnswerData } from './submission'

export enum FieldType {
  TEXTINPUT = 'TextInput',
  TEXTAREA = 'TextArea',
  CHECKBOX = 'Checkbox',
  DIALOG = 'Dialog',
  UPLOAD = 'Upload'
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

@Module({ namespaced: true, name: 'form', stateFactory: true })
export default class FormStore extends VuexModule {
  public status = 'unloaded'
  public fields: Question[] = []
  public form?: Form = undefined
  public error?: Error = undefined

  get questions(): Question[] {
    return this.form && this.form.questions ? this.form.questions : []
  }

  @Mutation
  setStatus(data: { status: string; error?: Error }): void {
    this.status = data.status
    this.error = data.error
  }

  @Mutation
  setError(error: Error): void {
    this.error = error
  }

  @Mutation
  setForm(form: Form): void {
    this.form = form
  }

  @Action({ commit: 'setForm' })
  async getForm(id: number): Promise<Form | undefined> {
    try {
      this.context.commit('setStatus', { status: 'loading' })

      const resp = await $axios.$get('/form/' + id)

      // This may need to go elsewhere depending on future logic.
      const answers: Record<string, AnswerData | null> = {}
      resp.questions.forEach((q: Question) => {
        answers[q.id] = null
      })
      this.context.commit('submission/setAnswers', answers, { root: true })

      this.context.commit('setStatus', { status: 'success' })
      return resp
    } catch (error) {
      this.context.commit('setStatus', { status: 'failure', error })
    }
  }
}
