import {
  computed,
  defineNuxtPlugin,
  ref,
  set,
  toRef,
} from '@nuxtjs/composition-api'
import { parseAxiosError } from '../utils/state.utils'

export type StateStatus = 'Idle' | 'Loading' | 'Error'

export interface StateError {
  url?: string
  status?: number
  message: string
}

declare module 'pinia' {
  export interface PiniaCustomStateProperties {
    status: StateStatus
    error: StateError | null
    isLoading: boolean
  }
}

type Procedure = (...args: any[]) => any

export default defineNuxtPlugin(({ $pinia }) => {
  $pinia.use(({ store, options }) => {
    if (!Object.hasOwnProperty.call(store.$state, 'status')) {
      const statusRef = ref('Idle')
      set(store.$state, 'status', statusRef)
      set(store, 'status', statusRef)

      const loadingRef = computed(() => store.status === 'Loading')
      set(store.$state, 'isLoading', loadingRef)
      set(store, 'isLoading', loadingRef)
    }

    if (!Object.hasOwnProperty.call(store.$state, 'status')) {
      set(store.$state, 'status', ref('Idle'))
      set(store.$state, 'error', ref(null))
      set(
        store.$state,
        'isLoading',
        computed(() => store.status === 'Loading')
      )
    }

    set(store, 'status', toRef(store.$state, 'status'))
    set(store, 'error', toRef(store.$state, 'error'))
    set(store, 'isLoading', toRef(store.$state, 'isLoading'))

    if (!options.actions) return

    return Object.keys(options.actions).reduce(
      (actions: Record<string, Procedure>, action) => {
        actions[action] = async (...args: []) => {
          try {
            store.status = 'Loading'
            store.error = null

            const result = await Promise.resolve(store[action](args))

            store.status = 'Idle'

            return result
          } catch (error) {
            store.status = 'Error'
            store.error = parseAxiosError(error)
          }
        }

        return actions
      },
      {}
    )
  })
})
