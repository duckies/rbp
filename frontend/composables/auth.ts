import { reactive, readonly, useContext } from '@nuxtjs/composition-api'
import { User } from '../interfaces/entities.interface'
import { useState } from './state'

export function useAuth() {
  const { status, error, setStatus, request } = useState()
  const {
    $axios,
    app: { $cookies },
  } = useContext()

  const state = reactive({
    user: null as User | null,
    token: null as string | null,
  })

  const getProfile = () =>
    request(async () => {
      const resp = await $axios.$get('/user/me')
      if (error) return

      state.user = resp
    })

  const init = async () => {
    const token = $cookies.get('rbp.token')

    if (!token) return

    state.token = token
    await getProfile()

    if (error) {
      state.token = null
    }
  }

  return {
    status,
    error,
    state: readonly(state),
    getProfile,
  }
}
