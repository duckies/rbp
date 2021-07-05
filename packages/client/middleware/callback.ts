import { Middleware } from '@nuxt/types'

const callbackMiddleware: Middleware = async (ctx) => {
  await ctx.$auth.handleCallback()
}

export default callbackMiddleware
