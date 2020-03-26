import { Plugin, Context } from '@nuxt/types'
import nanoid from 'nanoid'

export const encodeQuery = (queryObject: object): string => {
  return Object.entries(queryObject)
    .filter((tuple) => typeof Object.values(tuple)[0] !== 'undefined')
    .map(([key, value]) => encodeURIComponent(key) + (value != null ? '=' + encodeURIComponent(value) : ''))
    .join('&')
}

export class Auth {
  private readonly ctx: Context

  constructor(ctx: Context) {
    this.ctx = ctx
  }

  public login() {
    const authorization_endpoint = 'https://discordapp.com/api/oauth2/authorize'
    const opts = {
      response_type: 'code',
      client_id: '678486837626404885',
      scope: ['identify'],
      redirect_uri: process.env.REDIRECT_URL,
      state: nanoid(),
      prompt: 'none',
    }

    this.ctx.app.$cookies.set('rbp.state', opts.state)
    this.ctx.app.$cookies.set('rbp.redirect', this.ctx.app.context.route.path)

    const url = authorization_endpoint + '?' + encodeQuery(opts)

    window.location.href = url
  }

  public async handleCallback() {
    if (this.ctx.route.path !== '/callback' || !this.ctx.route.query.code) return

    const state = this.ctx.app.$cookies.get('rbp.state')
    this.ctx.app.$cookies.set('rbp.state', null)

    if (!state || this.ctx.route.query.state !== state) return

    try {
      const resp = await this.ctx.app.$axios.$get('/auth/discord/callback', {
        params: { code: this.ctx.route.query.code },
        baseURL: process.server ? process.env.BACKEND_SERVER_BASE_URL : process.env.BACKEND_CLIENT_BASE_URL,
      })

      if (resp.token) {
        this.ctx.app.$cookies.set('rbp.token', resp.token)
        this.ctx.app.$axios.setHeader('Authorization', `Bearer ${resp.token}`)
      }

      const redirect = this.ctx.app.$cookies.get('rbp.redirect')
      this.ctx.app.$cookies.set('rbp.redirect', false)

      if (redirect) {
        this.ctx.redirect(redirect)
      }
    } catch (error) {
      this.ctx.app.$store.state.auth.setUser(null)
      this.ctx.app.$axios.setHeader('Authorization', false)
      console.error(error)
    }
  }
}

const AuthPlugin: Plugin = (ctx, inject) => {
  const $auth = new Auth(ctx)

  inject('auth', $auth)
  ctx.$auth = $auth
}

export default AuthPlugin
