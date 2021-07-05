import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import { useCookies } from '@/composables/useCookies'
import { Framework } from 'vuetify'

declare module '@nuxt/types' {
  interface Context {
    $vuetify: Framework
  }
}

Vue.use(Vuetify)

export default defineNuxtPlugin((ctx) => {
  const isDark = useCookies(ctx).get('rbp.dark')

  const vuetify = new Vuetify({
    icons: {
      iconfont: 'mdi',
    },
    theme: {
      dark: !!isDark,
      themes: {
        dark: {
          primary: '#854feb',
        },
      },
    },
  })

  ctx.app.vuetify = vuetify
  ctx.$vuetify = vuetify.framework
})
