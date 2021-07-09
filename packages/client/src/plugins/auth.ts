import { useAuth } from '@/stores'
import { useUsers } from '@/stores/useUsers'
import { defineNuxtPlugin } from '@nuxtjs/composition-api'

export default defineNuxtPlugin(async ({ $cookies, $axios, $pinia }) => {
  const authStore = useAuth($pinia)
  const userStore = useUsers($pinia)

  // 1. Check for the token in order to fetch the user on the server.
  if (process.server) {
    await authStore.handleCallback()

    const token = $cookies.get<string | undefined>('rbp.token')

    // 2a. No token means the user isn't logged in.
    if (!token) return

    // 2b. Otherwise, we set the axios token on the server.
    $axios.setToken(token, 'Bearer')

    // 3. Fetch the user or account based on the token type.
    authStore.user = await userStore.getMyUser()

    // 4. Store credentials if successful.
    if (!authStore.error) {
      authStore.token = token
    } else if (authStore.error.status === 401) {
      authStore.logout()
    }
  }

  // 5. Set the token after the client renders.
  if (process.client && authStore.token) {
    $axios.setToken(authStore.token, 'Bearer')
  }
})
