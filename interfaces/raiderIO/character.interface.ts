export interface CharacterRaiderIO {
  name: string
  race: string
  class: string
  active_spec_name: string
  active_spec_role: string
  gender: string
  faction: string
  region: string
  realm: string
  profile_url: string
  raid_progression?: RaidProgressionList
  // TODO: Include the other possible fields.
}

export interface RaidProgressionList {
  [slug: string]: RaidProgression
}

export interface RaidProgression {
  summary: string
  totla_bosses: number
  normal_bosses_killed: number
  mythic_bosses_killed: number
}
