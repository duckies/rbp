import { User } from '../../../../server/src/user/user.entity'

export interface Article {
  id: number
  title: string
  slug: string
  subtitle: string
  content: string
  header?: string
  author: User
  createdAt: string
  updatedAt: string
}
