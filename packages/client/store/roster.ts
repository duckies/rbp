import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex'
import { FindCharacterDto } from '../../backend/src/blizzard/dto/find-character.dto'
import { FormCharacter, GuildCharacter } from '../interfaces/entities.interface'
import { StateError } from '../interfaces/state/state-error.interface'
import { StateStatus } from '../interfaces/state/state-status.enum'
import { parseAxiosError } from '../utils/state.utils'

export const state = () => ({
  status: StateStatus.UNLOADED,
  error: null as StateError | null,
  roster: [] as GuildCharacter[],
})

export const getters = getterTree(state, {
  isLoading: (state) => state.status === StateStatus.BUSY,
})

export const mutations = mutationTree(state, {
  setStatus(state, status: StateStatus) {
    state.status = status

    if (status === StateStatus.BUSY) {
      state.error = null
    }
  },
  setError(state, error: any) {
    state.status = StateStatus.ERROR
    state.error = parseAxiosError(error)
  },
  setRoster(state, characters: GuildCharacter[]) {
    state.roster = characters
  },
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async getRoster({ commit }) {
      try {
        commit('setStatus', StateStatus.BUSY)
        const [characters] = await this.$axios.$get('/characters/roster')

        commit('setStatus', StateStatus.WAITING)
        commit('setRoster', characters)
      } catch (error) {
        commit('setError', error)
      }
    },
    getCharacterData(_ctx, { name, realm, region }: FindCharacterDto): Promise<FormCharacter> {
      return this.$axios.$get(`/form-character/${region}/${realm}/${name}`)
    },
  }
)
