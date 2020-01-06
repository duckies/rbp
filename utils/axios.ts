import { NuxtAxiosInstance } from '@nuxtjs/axios'

/* eslint-disable import/no-mutable-exports */
let $axios: NuxtAxiosInstance
/* eslint-enable import/no-mutable-exports */

export function initializeAxios(axiosInstance: NuxtAxiosInstance): void {
  $axios = axiosInstance
}

export { $axios }
