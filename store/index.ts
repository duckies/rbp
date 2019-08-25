import cookie from 'cookie'
import { resetAuthToken, setAuthToken } from '~/utils/auth'

export const actions = {
  async nuxtServerInit({ dispatch }, context): Promise<void> {
    const cookies = cookie.parse(context.req.headers.cookie || '')

    if (cookies.hasOwnProperty('x-access-token')) {
      setAuthToken(cookies['x-access-token'])

      await dispatch('auth/getMe')
    } else {
      resetAuthToken()
    }
  }
}
