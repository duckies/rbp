export default function({ $axios, store }): void {
  $axios.onRequest(config => {
    if (store.state.auth.token) {
      // console.info(`Making request to ${config.url} with token ${store.state.auth.token}`)
      config.headers.common.Authorization = 'Bearer ' + store.state.auth.token
    }
  })
}
