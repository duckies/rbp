import { Configuration } from '@nuxt/types'

const config: Partial<Configuration> = {
  mode: 'universal',

  buildModules: ['@nuxt/typescript-build', '@nuxtjs/vuetify'],

  head: {
    title: 'Really Bad Players',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Gaming platform' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Khand:700&display=swap'
      }
    ]
  },

  loading: { color: '#854feb' },

  css: ['~assets/style/global.scss'],

  plugins: [
    { src: '~/plugins/flickity', ssr: false },
    { src: '~/plugins/axios' }
  ],

  modules: ['@nuxtjs/axios', 'nuxt-webfontloader'],

  vuetify: {
    customVariables: ['~/assets/styles/vuetify.scss'],
    treeShake: true,
    optionsPath: './vuetify.options.ts'
  },

  axios: {
    baseURL: 'http://localhost:3000/',
    credentials: true
  },

  webfontloader: {
    google: {
      families: [
        'Roboto:300,400,500,700',
        'Material+Icons',
        'Khand:300,400,500,700',
        'Roboto+Mono:400'
      ]
    }
  },

  vue: {
    config: {
      productionTip: false
    }
  },

  build: {
    extend(config, ctx): void {
      // Run ESLint on save
      if (config && config.module && ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}

export default config
