import { actionTree, getAccessorType } from 'nuxt-typed-vuex'
import * as blog from '~/store/blog'
import * as discord from '~/store/discord'
import * as form from '~/store/form'
import * as raid from '~/store/raid'
import * as roster from '~/store/roster'
import * as slide from '~/store/slide'
import * as submission from '~/store/submission'
import * as user from '~/store/user'

export const state = () => ({})

export const actions = actionTree(
  { state },
  {
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
)

export const accessorType = getAccessorType({
  state,
  actions,
  modules: {
    blog,
    raid,
    roster,
    discord,
    user,
    form,
    submission,
    slide,
  },
})
