import { defineNuxtMiddleware } from '@nuxtjs/composition-api'
import { useAuth } from '../stores'

export default defineNuxtMiddleware(({ $pinia, redirect }) => {
  const auth = useAuth($pinia)

  if (!auth.isOfficer) {
    return redirect('/')
  }
})
