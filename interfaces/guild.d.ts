import { CharacterResponse } from './character';

export interface Member {
  character: CharacterResponse
  rank: number
}

export default interface GuildResponse {
  lastModified: number
  name: string
  realm: string
  battlegroup: string
  level: number
  side: number
  achievementPoints: number
  members: Member[]
}