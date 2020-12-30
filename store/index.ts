import { ActionTree } from 'vuex'

export const state = () => ({})

export type RootState = ReturnType<typeof state>

export const actions: ActionTree<RootState, RootState> = {
  async nuxtServerInit({ commit, dispatch }): Promise<void> {
    const token = this.$cookies.get('rbp.token')

    if (token) {
      try {
        commit('user/setToken', token)
        await dispatch('user/getProfile')
      } catch (error) {
        console.error(error)
        dispatch('user/logout')
      }
    }
  },
}
