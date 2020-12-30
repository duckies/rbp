import { Plugin } from '@nuxt/types'

const AxiosPlugin: Plugin = ({ $axios, store }) => {
  $axios.onRequest((config) => {
    const token = store.state.user.token

    if (token) config.headers.common.Authorization = `Bearer ${token}`
  })
}

export default AxiosPlugin
