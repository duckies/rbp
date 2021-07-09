import { RealmSlug } from '../constants/realm-slug.enum'
import { Region } from '../constants/region.enum'

export interface Character {
  id: number
  name: string
  region: Region
  realm: RealmSlug
}
