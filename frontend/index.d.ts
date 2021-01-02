import { NuxtCookies } from 'cookie-universal-nuxt'
import { Auth } from '~/plugins/auth'
import { accessorType } from '~/store'

declare module 'vue-flickity'

declare module 'vue/types/vue' {
  interface Vue {
    $auth: Auth
    $accessor: typeof accessorType
  }
}

declare module '@nuxt/types' {
  interface Context {
    $auth: Auth
  }

  interface NuxtAppOptions {
    $auth: Auth
    $accessor: typeof accessorType
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $auth: Auth
    $cookies: NuxtCookies
  }
}
