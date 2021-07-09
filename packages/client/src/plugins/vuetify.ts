import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import { Framework } from 'vuetify'

declare module '@nuxt/types' {
  interface Context {
    $vuetify: Framework
  }
}

Vue.use(Vuetify)

export default defineNuxtPlugin((ctx) => {
  // const isDark = ctx.$cookies.get('rbp.dark') === 'true'

  const vuetify = new Vuetify({
    icons: {
      iconfont: 'mdi',
    },
    theme: {
      // dark: isDark,
      dark: true,
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
