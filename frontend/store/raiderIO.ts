export enum Expansion {
  BATTLE_FOR_AZEROTH = 'Battle for Azeroth',
  LEGION = 'Legion',
}

export interface Tier {
  id: number
  name: string
  slug: string
  expansion: Expansion
  background: string
  progress: number
  world: number
  region: number
  realm: number
  summary: string
  total_bosses: number
  normal_bosses_killed: number
  heroic_bosses_killed: number
  mythic_bosses_killed: number
  isFeatured: boolean
  updatedAt: Date
}

export interface MythicPlusSeasonScores {
  all: number
  dps: number
  healer: number
  tank: number
  spec_0: number
  spec_1: number
  spec_2: number
  spec_3: number
}

export interface MythicPlusSeason {
  season: string
  scores: MythicPlusSeasonScores
}

export interface Affix {
  id: number
  name: string
  description: string
  wowhead_url: string
}

export interface DungeonRun {
  dungeon: string
  short_name: string
  mythic_level: number
  completed_at: Date
  clear_time_ms: number
  num_keystone_upgrades: number
  map_challenge_mode_id: number
  scores: number
  affixes: Affix[]
  url: string
}

export interface Gear {
  item_level_equipped: number
  item_level_total: number
  artifact_traits: number
}

export interface RaiderIOCharacter {
  name: string
  race: string
  class: string
  active_spec_name: string
  active_spec_role: string
  gender: string
  faction: string
  achievement_points: number
  honorable_kills: number
  thumbnail_url: string
  region: string
  realm: string
  profile_url: string
  profile_banner: string
  mythic_plus_scores_by_season: MythicPlusSeason[]
  mythic_plus_recent_runs: DungeonRun[]
  mythic_plus_best_runs: DungeonRun[]
  gear: Gear
}

// @Module({ namespaced: true, name: 'raiderIO', stateFactory: true })
// export default class RaiderIOModule extends VuexModule {
//   status = 'unloaded'
//   tiers: Tier[] = []
//   error: Error | null = null

//   @Mutation
//   setStatus(data: { status: string; error?: Error }): void {
//     this.status = data.status
//     this.error = data.error || null
//   }

//   @Mutation
//   setTiers(tiers: Tier[]): void {
//     this.tiers = tiers
//   }

//   @Action({ commit: 'setTiers' })
//   async getRaiderIO(): Promise<Tier[]> {
//     try {
//       this.context.commit('setStatus', StateStatus.BUSY)
//       const data = await $axios.$get('/raids/featured')
//       this.context.commit('setStatus', StateStatus.WAITING)

//       return data
//     } catch (error) {
//       this.context.commit('setError', error)
//       return []
//     }
//   }

//   @Action({ commit: 'setTiers' })
//   async getCharacterRaiderIO(data: CharacterLookupDto): Promise<RaiderIOCharacter | undefined> {
//     try {
//       this.context.commit('setStatus', StateStatus.BUSY)
//       const resp = await $axios.$get(`/raiderio/${data.region}/${data.realm}/${data.name}`)
//       this.context.commit('setStatus', StateStatus.WAITING)

//       return resp
//     } catch (error) {
//       this.context.commit('setError', error)
//     }
//   }
// }
