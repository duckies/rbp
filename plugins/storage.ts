import { Context } from '@nuxt/types'
import { parse as parseCookie, serialize as serializeCookie } from 'cookie'
import { merge } from 'lodash'
import { decodeValue, isUnset, encodeValue, isSet } from './utils'

/**
 * Based on the @nuxtjs/auth storage system minified to only use cookies (for now)
 * https://github.com/nuxt-community/auth-module/blob/dev/lib/core/storage.js
 */

export interface StorageOptions {
  prefix?: string
  cookieOpts?: object
}

export const defaults: StorageOptions = {
  prefix: 'rbp.',
  cookieOpts: {}
}

export interface CookieOptions {
  maxAge?: number | Date
}

export default class Storage {
  private readonly ctx: Context
  private readonly options: StorageOptions

  constructor(ctx: Context, options: StorageOptions) {
    this.ctx = ctx
    this.options = merge({}, defaults, options)
  }

  /**
   * Universal (For future)
   */

  setUniveral<T>(key: string, value: T): void | T {
    // If null or undefined, remove instead.
    if (isUnset(value)) {
      return this.removeUniversal(key)
    }

    this.setCookie(key, value)

    return value
  }

  getUniversal(key: string): unknown {
    const value = this.getCookie(key)

    return value
  }

  syncUniversal(key: string, defaultValue?: unknown): unknown {
    let value = this.getUniversal(key)

    if (isUnset(value) && isSet(defaultValue)) {
      value = defaultValue
    }

    if (isSet(value)) {
      this.setUniveral(key, value)
    }

    return value
  }

  removeUniversal(key: string): void {
    this.removeCookie(key)
  }

  /**
   * Cookies
   */

  getCookies(): Record<string, string> {
    const cookieStr = process.client ? document.cookie : this.ctx.req.headers.cookie

    return parseCookie(cookieStr || '') || {}
  }

  setCookie<T>(key: string, value: T, options?: CookieOptions): T {
    const _key = this.options.prefix + key
    const _options = Object.assign({}, this.options.cookieOpts, options)
    const _value = encodeValue(value)

    // Null or undefined removes cookie.
    if (isUnset(value)) {
      _options.maxAge = -1
    }

    const serializedCookie = serializeCookie(_key, _value, _options)

    if (process.client) {
      // Set in browser
      document.cookie = serializedCookie
    } else if (process.server && this.ctx.res) {
      // Send Set-Cookie header from server side
      const prevCookies = this.ctx.res.getHeader('Set-Cookie')
      this.ctx.res.setHeader(
        'Set-Cookie',
        [].concat(prevCookies as never, serializedCookie as never).filter((v: unknown) => v)
      )
    }

    return value
  }

  getCookie(key: string): unknown {
    if (process.server && !this.ctx.req) {
      return
    }

    const _key = this.options.prefix + key
    const cookies = this.getCookies()
    const value = cookies[_key] ? decodeURIComponent(cookies[_key]) : undefined

    return decodeValue(value)
  }

  removeCookie(key: string, options?: object): void {
    this.setCookie(key, undefined, options)
  }
}
