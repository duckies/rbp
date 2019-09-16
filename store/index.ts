import cookie from 'cookie'

export const actions = {
  async nuxtServerInit({ commit, dispatch }, context): Promise<void> {
    const cookies = cookie.parse(context.req.headers.cookie || '')

    if (cookies.hasOwnProperty('x-access-token')) {
      console.info(`Found access token ${cookies['x-access-token']}`)
      commit('auth/setToken', cookies['x-access-token'])

      await dispatch('auth/getMe')
    } else {
      dispatch('auth/logout')
    }
  }
}
