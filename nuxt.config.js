require('dotenv').config()

const NuxtConfiguration = {
  mode: 'universal',

  env: {
    FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL || 'http://localhost:3030',
    FRONTEND_FILE_UPLOAD_URL: process.env.FRONTEND_FILE_UPLOAD_URL || 'http://localhost:3000/submission/upload',
    BACKEND_SERVER_BASE_URL: process.env.BACKEND_SERVER_BASE_URL || 'http://localhost:3000/',
    BACKEND_CLIENT_BASE_URL: process.env.BACKEND_CLIENT_BASE_URL || 'http://localhost:3000/',
    REDIRECT_URL: process.env.REDIRECT_URL || 'http://localhost:3030/callback',
  },

  server: {
    port: process.env.FRONTEND_PORT || 3030,
  },

  head: {
    title: 'Really Bad Players',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Gaming platform for the Really Bad Players World of Warcraft Horde guild on Area 52',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Khand:700,900&display=swap' },
    ],
  },

  loading: { color: '#854feb', continuous: true },

  css: ['~/assets/style/global.scss'],

  plugins: ['~/plugins/auth', '~/plugins/axios', '~/plugins/vee-validate', { src: '~/plugins/swiper', mode: 'client' }],

  modules: ['@nuxtjs/axios', 'cookie-universal-nuxt'],

  components: true,

  vuetify: {
    customVariables: ['~/assets/styles/vuetify.scss'],
    icons: {
      iconfont: 'mdiSvg',
    },
    frameworkOptions: {
      theme: {
        dark: true,
        themes: {
          dark: {
            primary: '#854feb',
          },
        },
      },
    },
  },

  axios: {
    baseURL: process.env.BACKEND_BASE_URL || 'http://localhost:3000/',
    browserBaseURL: process.env.BACKEND_BROWSER_BASE_URL || 'http://localhost:3000/',
  },

  vue: {
    config: {
      productionTip: false,
    },
  },

  router: {
    middleware: 'callback',
  },

  modern: process.env.NODE_ENV === 'production',

  buildModules: ['@nuxt/typescript-build', '@nuxtjs/vuetify'],

  build: {
    transpile: ['vee-validate/dist/rules'],
  },
}

export default NuxtConfiguration
