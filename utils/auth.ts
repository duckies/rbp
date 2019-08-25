import axios from 'axios'

export function setAuthToken (token: string) {
  axios.defaults.headers.common.Authorization = 'Bearer ' + token
}

export function resetAuthToken () {
  delete axios.defaults.headers.common.Authorization
}
