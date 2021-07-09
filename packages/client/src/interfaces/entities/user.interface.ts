import { Roles } from '../../../../server/src/app.roles'
import { Article } from './index'

export interface User {
  id: number
  discord_id: string
  discord_username: string
  discord_discriminator: string
  discord_avatar?: string
  roles: Roles[]
  avatar: string | null
  articles: Article[]
  createdAt: string
  updatedAt: string
}
