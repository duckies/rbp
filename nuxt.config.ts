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
    baseURL: 'http://localhost:3000'
  },

  auth: {
    redirectPath: '/callback',
    tokenEndpoint: 'http://localhost:3000/auth/discord/callback',
    authorization_endpoint: 'https://discordapp.com/api/oauth2/authorize',
    redirect_uri: 'http://localhost:3030/callback',
    scope: ['identify'],
    client_id: '678486837626404885',
    grant_type: 'authorization_code',
    response_type: 'code'
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
    cache: true,
    transpile: ['vee-validate/dist/rules'],
    babel: {
      plugins: ['@babel/plugin-proposal-optional-chaining']
    }
  }
}

export default NuxtConfiguration
