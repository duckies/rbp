import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import { Context } from '@nuxt/types'

Vue.use(Vuetify)

export default (ctx: Context) => {
  const vuetify = new Vuetify({
    icons: {
      iconfont: 'mdi',
    },
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: '#854feb',
        },
      },
    },
  })

  ctx.app.vuetify = vuetify
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  ctx.$vuetify = vuetify.framework
}
