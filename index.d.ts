import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { Context } from '@nuxt/types'
import Storage from './plugins/storage'
import { Auth } from './plugins/auth'

declare module '@nuxt/types' {
  interface Context {
    $storage: Storage
    $auth: Auth
  }
}

declare module 'vuex-module-decorators/dist/types/' {
  interface VuexModule {
    $axios: NuxtAxiosInstance
    $nuxt: Context
  }
}
