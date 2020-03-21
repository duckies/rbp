import { Configuration } from '@nuxt/types'

require('dotenv').config()

const NuxtConfiguration: Partial<Configuration> = {
  mode: 'universal',

  env: {
    fileUploadURL: process.env.FRONTEND_FILE_UPLOAD_URL || 'http://localhost:3000/submission/upload',
    localBaseURL: process.env.BACKEND_BASE_URL || 'http://localhost:3000',
    browserBaseURL: process.env.BACKEND_BROWSER_BASE_URL || 'http://localhost:3000',
    tokenEndpoint: process.env.TOKEN_ENDPOINT || 'http://localhost:3000/auth/discord/callback',
    redirectURL: process.env.REDIRECT_URL || 'http://localhost:3030/callback',
    frontendBaseURL: process.env.FRONTEND_BASE_URL || 'http://localhost:3030'
  },

  server: {
    port: process.env.FRONTEND_PORT || 3030
  },

  typescript: {
    typeCheck: {
      eslint: true
    }
  },

  head: {
    title: 'Really Bad Players',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Gaming platform' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }]
  },

  loading: { color: '#854feb' },

  css: ['~/assets/style/global.scss'],

  plugins: [
    { src: '~/plugins/flickity', ssr: false },
    { src: '~/plugins/vee-validate' },
    { src: '~/plugins/axios-accessor' },
    { src: '~/plugins/auth' }
  ],

  modules: ['@nuxtjs/axios', 'nuxt-webfontloader'],

  vuetify: {
    customVariables: ['~/assets/styles/vuetify.scss'],
    progressiveImages: true,
    icons: {
      iconfont: 'mdiSvg'
      // values: {
      //   discord: {
      //     component: DiscordLogoSVG
      //   }
      // }
    },
    frameworkOptions: {
      theme: {
        dark: true,
        themes: {
          dark: {
            primary: '#854feb'
          }
        }
      }
    }
  },

  axios: {
    baseURL: process.env.BACKEND_BASE_URL || 'http://localhost:3000',
    browserBaseURL: process.env.BACKEND_BROWSER_BASE_URL || 'http://localhost:3000'
  },

  webfontloader: {
    google: {
      families: ['Roboto:300,400,500,700', 'Khand:300,400,500,700', 'Roboto+Mono:400', 'Montserrat:400,500,700']
    }
  },

  vue: {
    config: {
      productionTip: false
    }
  },

  buildModules: ['@nuxt/typescript-build', '@nuxtjs/vuetify'],

  build: {
    // Pulls css into files instead of injecting them in the header
    // for better cache support.
    // extractCSS: true,
    transpile: ['vee-validate/dist/rules'],
    babel: {
      plugins: ['@babel/plugin-proposal-optional-chaining']
    },
    extend: (config): void => {
      config.node = {
        fs: 'empty'
      }
    }
  }
}

export default NuxtConfiguration
