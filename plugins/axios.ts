import { NuxtAxiosInstance } from '@nuxtjs/axios';

export default function({ $axios, store }) {
  ($axios as NuxtAxiosInstance).onRequest(config => {
    
    if (store.state.auth.token) {
      console.info(`Making request to ${config.url} with token ${store.state.auth.token}`)
      config.headers.common['Authorization'] = 'Bearer ' + store.state.auth.token
    }
  })
}