import { GetterTree, MutationTree, ActionTree } from 'vuex/types/index'
import { CharacterLookupDto } from '../interfaces/character-lookup.dto'

export enum Expansion {
  BATTLE_FOR_AZEROTH = 'Battle for Azeroth',
  LEGION = 'Legion'
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

export interface RaiderIOState {
  status: string
  tiers: Tier[]
  errors: Error[]
}

export const state = (): RaiderIOState => ({
  status: 'unloaded',
  tiers: [],
  errors: []
})

export const getters: GetterTree<RaiderIOState, RaiderIOState> = {
  tiers(state): Tier[] {
    return state.tiers
  }
}

export const mutations: MutationTree<RaiderIOState> = {
  setStatus(state, { status }): void {
    state.status = status
  },

  addError(state, { error }): void {
    state.status = 'error'
    state.errors.unshift(error)
  },

  popError(state): void {
    state.errors.pop()
  },

  setTiers(state, { tiers }): void {
    state.tiers = tiers
  }
}

export const actions: ActionTree<RaiderIOState, RaiderIOState> = {
  async getRaiderIO({ commit }): Promise<void> {
    commit('setStatus', 'loading')

    try {
      const resp = await this.$axios.$get('/raiderIO')
      commit('setStatus', 'success')
      commit('setTiers', resp.data)
    } catch (error) {
      commit('setStatus', 'error')
      commit('addError', error)
    }
  },

  async getCharacterRaiderIO(
    { commit },
    data: CharacterLookupDto
  ): Promise<RaiderIOCharacter | undefined> {
    commit('setStatus', 'loaded')

    try {
      const resp = await this.$axios.$get(
        `/raiderio/${data.region}/${data.realm}/${data.name}`
      )
      commit('setStatus', 'success')
      return resp
    } catch (error) {
      commit('setStatus', 'error')
      commit('addError', error)
      return undefined
    }
  }
}
