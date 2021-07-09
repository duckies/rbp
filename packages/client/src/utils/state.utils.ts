import { AxiosError } from 'axios'
import { StateError } from '../interfaces/state/state-error.interface'

/**
 * Parses an Axios error to avoid cyclic dependency
 * errors in Vuex.
 *
 * @param error Axios error.
 */
export const parseAxiosError = (error: AxiosError): StateError => {
  if (error.response) {
    let message: string

    if (error.response.status === 409 && error.config.url?.includes('register')) {
      message = 'An account with this email already exists.'
    } else {
      message = getErrorMessage(error.response.status)
    }

    return {
      url: error.config.url,
      status: error.response.status,
      message,
    }
  }

  return { message: error.message }
}

export const getErrorMessage = (status: number) => {
  switch (status) {
    case 413:
      return 'The upload is too large.'
    case 409:
      return 'The resource already exists in the database.'
    case 404:
      return 'The resource was not found.'
    case 400:
      return 'The request was not accepted by the server, ensure the necessary information was provided and try again, or contact an administrator.'
    default:
      return 'An unexpected error occured, please try again later.'
  }
}
