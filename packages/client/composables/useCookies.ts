import { Context } from '@nuxt/types'
import { useContext } from '@nuxtjs/composition-api'
import { CookieSerializeOptions } from 'cookie'
import { GetOptions } from 'cookie-universal-nuxt'

const THOUSAND_YEARS = 365 * 24 * 60 * 60 * 1000

type UsedContext = Context | ReturnType<typeof useContext>

export const useCookies = (ctx: UsedContext = useContext()) => {
  const get = (key: string, options?: GetOptions) => {
    return ctx.$cookies.get(key, options)
  }

  const set = (
    key: string,
    value: any,
    options: CookieSerializeOptions = {
      maxAge: THOUSAND_YEARS,
    }
  ) => {
    ctx.$cookies.set(key, value, options)
  }

  const remove = (key: string, options?: CookieSerializeOptions) => {
    ctx.$cookies.remove(key, options)
  }

  const removeAll = () => ctx.$cookies.removeAll

  return {
    get,
    set,
    remove,
    removeAll,
  }
}
