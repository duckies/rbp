import { Configuration } from '@nuxt/types'

const config: Configuration = {
  mode: 'universal',

  buildModules: ['@nuxt/typescript-build', '@nuxtjs/vuetify'],

  /**
   * Server Settings
   */
  router: {
    // middleware: 'auth'
  },

  // Why is this required?
  dir: {},

  /*
   ** Headers of the page
   */
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

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#854feb' },

  /*
   ** Global CSS
   */
  css: ['~assets/style/global.scss'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/flickity', ssr: false },
    { src: '~/plugins/axios' }
  ],

  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/axios', 'nuxt-webfontloader'],
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
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

  vuetify: {
    customVariables: ['~/assets/style/variables.scss'],
    treeShake: true,
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: '#854feb'
        }
      }
    }
  },

  /*
   ** Build configuration
   */
  build: {
    transpile: ['vuetify/lib'],

    /*
     ** You can extend webpack config here
     */
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
