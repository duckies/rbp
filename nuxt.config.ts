import { Configuration } from '@nuxt/types'

const NuxtConfiguration: Partial<Configuration> = {
  mode: 'universal',

  server: {
    // host: process.env.FRONTEND_HOST || '127.0.0.1',
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
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  loading: { color: '#854feb' },

  css: ['~/assets/style/global.scss'],

  plugins: [
    { src: '~/plugins/flickity', ssr: false },
    { src: '~/plugins/vee-validate' },
    { src: '~/plugins/axios-accessor' },
    // { src: '~/plugins/store' },
    { src: '~/plugins/auth' }
  ],

  modules: ['@nuxtjs/axios', 'nuxt-webfontloader'],

  vuetify: {
    customVariables: ['~/assets/styles/vuetify.scss'],
    progressiveImages: true,
    icons: {
      iconfont: 'mdiSvg'
    },
    frameworkOptions: {
      theme: {
        dark: true,
        themes: {
          dark: {
            primary: '#cddc39'
          }
        }
      }
    }
  },

  axios: {
    https: process.env.BACKEND_HTTPS || false,
    host: process.env.BACKEND_HOST || '127.0.0.1',
    port: process.env.BACKEND_PORT || 3000
  },

  auth: {
    rewriteRedirects: true,
    redirect: {
      callback: '/auth'
    },
    strategies: {
      battlenet: {
        _scheme: 'oauth2',
        authorization_endpoint: 'https://us.battle.net/oauth/authorize',
        token_endpoint: 'http://localhost:3000/battlenet/callback',
        userinfo_endpoint: '/me',
        scope: ['wow.profile'],
        client_id: '032ed041ad3446efbc559dfa954a9783',
        grant_type: 'authorization_code',
        response_type: 'code',
        token_key: 'code'
      }
    }
  },

  webfontloader: {
    google: {
      families: ['Roboto:300,400,500,700', 'Khand:300,400,500,700', 'Roboto+Mono:400', 'Quicksand:400,700']
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
    extractCSS: true,
    transpile: ['vee-validate/dist/rules']
  }
}

export default NuxtConfiguration
