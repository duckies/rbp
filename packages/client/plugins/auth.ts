import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import { useAuth } from '@/stores'
import { useCookies } from '@/composables/useCookies'
import { useUsers } from '../stores/useUsers'

export default defineNuxtPlugin(async ({ $cookies, $axios, $pinia }) => {
  const authStore = useAuth($pinia)
  const userStore = useUsers($pinia)

  // 1. Check for the token in order to fetch the user on the server.
  if (process.server) {
    const token = $cookies.get<string | undefined>('rbp.token')

    // 2a. No token means the user isn't logged in.
    if (!token) return

    // 2b. Otherwise, we set the axios token on the server.
    $axios.setToken(token, 'Bearer')

    // 3. Fetch the user or account based on the token type.
    authStore.user = await userStore.getMyUser()
  }

  const token = $cookies.get('rbp.token')

  if (!token) return

  try {
    authStore.token = token
    authStore.user = await userStore.getMyUser()
  } catch (error) {
    authStore.token = null
    authStore.user = null

    $cookies.remove('rbp.token')
  }
})
