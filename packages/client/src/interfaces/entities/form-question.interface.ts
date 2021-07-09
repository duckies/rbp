import { Form } from './form.interface'

export enum FieldType {
  TEXTINPUT = 'TextInput',
  TEXTAREA = 'TextArea',
  CHECKBOX = 'Checkbox',
  SELECT = 'Select',
  RADIO = 'Radio',
  UPLOAD = 'Upload',
}

export enum FileTypes {
  Image = 'image/*',
}

export interface FormQuestion {
  id: string
  question: string
  label?: string
  hint?: string
  required: boolean
  choices?: string[]
  multiple?: number
  order: number
  type: FieldType
  fileTypes?: FileTypes[]
  deleted: boolean
  hasAnswers: boolean
  form: Form
  createdAt: string
  updatedAt: string
}
