import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { Context } from '@nuxt/types'
import { Auth } from './plugins/auth'
import Storage from './plugins/storage'

// declare module 'nuxt-dropzone'

declare module 'vue/types/vue' {
  interface Vue {
    $auth: Auth
    $storage: Storage
  }
}

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
