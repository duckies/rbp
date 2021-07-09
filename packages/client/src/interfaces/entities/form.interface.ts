import { FormQuestion } from './form-question.interface'

export interface Form {
  id: number
  name: string
  createdAt: string
  updatedAt: string
  questions: FormQuestion[]
}
