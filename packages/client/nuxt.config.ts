import { resolve } from 'path'
import { NuxtConfig } from '@nuxt/types'
import { VuetifyLoaderPlugin } from 'vuetify-loader'

const config: NuxtConfig = {
  ssr: true,
  srcDir: 'src/',
  buildDir: 'dist/',
  server: {
    port: process.env.CLIENT_PORT || 9000,
  },
  alias: {
    '@client': resolve(__dirname, '../client/src'),
    '@server': resolve(__dirname, '../server/src'),
  },
  env: {
    FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL || 'http://localhost:9000',
    FRONTEND_FILE_UPLOAD_URL:
      process.env.FRONTEND_FILE_UPLOAD_URL ||
      'http://localhost:3000/submission/upload',
    BACKEND_SERVER_BASE_URL:
      process.env.BACKEND_SERVER_BASE_URL || 'http://localhost:3000/',
    BACKEND_CLIENT_BASE_URL:
      process.env.BACKEND_CLIENT_BASE_URL || 'http://localhost:3000/',
    REDIRECT_URL: process.env.REDIRECT_URL || 'http://localhost:9000/callback',
  },
  head: {
    title: 'Really Bad Players',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'Gaming platform for the Really Bad Players World of Warcraft Horde guild on Area 52',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
      {
        rel: 'dns-prefetch',
        href: '//fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: true,
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Khand:wght@700&family=Roboto:wght@400;500;700;900',
      },
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css',
      },
    ],
  },
  loading: { color: '#854feb', continuous: true },
  css: ['~/assets/styles/global.scss'],
  plugins: [
    '~/plugins/vuetify',
    // '~/plugins/pinia',
    '~/plugins/auth',
    '~/plugins/vee-validate',
    { src: '~/plugins/swiper', mode: 'client' },
  ],
  components: ['~/components', '~/components/inputs'],
  typescript: {
    typeCheck: false,
  },
  axios: {
    baseURL: process.env.BACKEND_BASE_URL || 'http://localhost:3000/',
    browserBaseURL:
      process.env.BACKEND_BROWSER_BASE_URL || 'http://localhost:3000/',
  },
  modern: process.env.NODE_ENV === 'production',
  modules: ['@nuxtjs/axios', '@nuxt/image', 'cookie-universal-nuxt'],
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/composition-api/module',
    '@nuxt/postcss8',
    'pinia/nuxt',
  ],
  build: {
    parallel: true,
    transpile: ['vee-validate/dist/rules', 'vuetify/lib'],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      sass: {
        // @ts-ignore Outdated @types/sass-loader
        additionalData: "@import '@/assets/styles/vuetify.scss'",
      },
    },
  },
}

export default config
