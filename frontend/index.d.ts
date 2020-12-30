import { NuxtCookies } from 'cookie-universal-nuxt'
import { Auth } from '~/plugins/auth'

declare module 'vue-flickity'

declare module 'vue/types/vue' {
  interface Vue {
    $auth: Auth
  }
}

declare module '@nuxt/types' {
  interface Context {
    $auth: Auth
  }

  interface NuxtAppOptions {
    $auth: Auth
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $auth: Auth
    $cookies: NuxtCookies
  }
}
