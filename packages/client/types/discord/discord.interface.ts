export interface Channel {
  position: number
  id: string
  name: string
  members?: Member[]
}

export interface Game {
  name: string
}

export interface Member {
  username: string
  status: string
  mute?: boolean
  suppress?: boolean
  deaf?: boolean
  channel_id?: string
  nick?: string
  game?: Game
  avatar_url: string
  avatar: string
  self_deaf?: boolean
  discriminator: string
  self_mute?: boolean
  id: string
}

export interface Discord {
  channels: Channel[]
  instant_invite: string
  id: string
  members: Member[]
  name: string
}