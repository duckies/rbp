import nanoid from 'nanoid'
import { Context, Plugin } from '@nuxt/types'
import { merge } from 'lodash'
import { $axios } from '../utils/axios'
import Storage from './storage'
import { encodeQuery } from './utils'
import { authStore } from '@/store'

/* eslint-disable @typescript-eslint/camelcase */

interface AuthOptions {
  redirectPath: string
  authorization_endpoint: string
  tokenEndpoint: string
  response_type: string
  client_id: string
  redirect_uri: string
  scope: string[]
}

const defaults = {
  redirectPath: '/callback',
  tokenEndpoint: 'http://localhost:3000/auth/discord/callback',
  authorization_endpoint: 'https://discordapp.com/api/oauth2/authorize',
  redirect_uri: 'http://localhost:3030/callback',
  response_type: 'code',
  client_id: '678486837626404885',
  scope: ['identify']
  // authorization_endpoint: 'https://us.battle.net/oauth/authorize',
  // tokenEndpoint: 'http://localhost:3000/auth/blizzard/callback',
  // client_id: '032ed041ad3446efbc559dfa954a9783',
  // redirect_uri: 'http://localhost:3030/callback',
  // scope: ['wow.profile'],
}

export class Auth {
  private readonly ctx: Context
  private readonly options: AuthOptions

  constructor(ctx: Context, options: Partial<AuthOptions>) {
    this.ctx = ctx
    this.options = merge({}, defaults, options)
  }

  /**
   * Initializes the authentication module.
   */
  async init(): Promise<void> {
    const token = this.ctx.$storage.getCookie('token')

    if (token && typeof token === 'string') {
      this._setToken(token)
    }

    await this._handleCallback()

    if (token) {
      return this._fetchUserOnce()
    }
  }

  login(): void {
    const opts = {
      client_id: this.options.client_id,
      scope: this.options.scope,
      state: nanoid(),
      redirect_uri: this.options.redirect_uri,
      response_type: this.options.response_type
    }

    this.ctx.$storage.setCookie('state', opts.state)
    this.ctx.$storage.setCookie('redirect', this.ctx.route.fullPath)

    const url = this.options.authorization_endpoint + '?' + encodeQuery(opts)

    window.location.assign(url)
  }

  logout(): void {
    this.ctx.$storage.removeCookie('token')
    this._clearToken()
    authStore.clearUser()
  }

  private async _handleCallback(): Promise<boolean> {
    if (this.ctx.route.path !== this.options.redirectPath) {
      return false
    }

    // Callback flow is not supported on static sites.
    if (process.server && process.static) {
      return false
    }

    const parsedQuery = Object.assign({}, this.ctx.route.query, this.ctx.route.hash)

    const state = this.ctx.$storage.getCookie('state')
    this.ctx.$storage.removeCookie('state')

    if (!state || parsedQuery.state !== state) {
      return false
    }

    try {
      const data = await $axios.$get(this.options.tokenEndpoint, {
        params: { code: parsedQuery.code }
      })

      // Send token to auth
      if (data.token) {
        this._setToken(data.token)
        this.ctx.$storage.setCookie('token', data.token)
      }

      const redirect = this.ctx.$storage.getCookie('redirect')
      this.ctx.$storage.removeCookie('redirect')

      if (redirect && typeof redirect === 'string') {
        this.redirect(redirect)
      }

      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  public redirect(path: string): void {
    this.ctx.redirect(path)
  }

  // Sets the Authorization header for all axios requests.
  private _setToken(token: string): void {
    $axios.setHeader('Authorization', 'Bearer ' + token)
  }

  // Removes the Authorization header for all axios requests.
  private _clearToken(): void {
    $axios.setHeader('Authorization', false)
  }

  private async _fetchUserOnce(): Promise<void> {
    try {
      await authStore.fetchUser()
    } catch (error) {
      console.error(error)
    }

    return Promise.resolve()
  }
}

const authPlugin: Plugin = (ctx, inject) => {
  const $auth = new Auth(ctx, {})
  const $storage = new Storage(ctx, {})

  inject('storage', $storage)
  inject('auth', $auth)
  ctx.$storage = $storage
  ctx.$auth = $auth

  return $auth.init()
}

export default authPlugin
