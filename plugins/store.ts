// import { Plugin } from '@nuxt/types'
// import { getModule } from 'vuex-module-decorators'
// import ApplicationModule from '../store/form'
// import CharacterModule from '../store/character'

// import AuthModule from '@/store/auth'
// import BlogModule from '@/store/blog'
// import DiscordModule from '@/store/discord'
// import RaidModule from '@/store/raid'
// import SlideModule from '@/store/slide'
// import SubmissionModule from '@/store/submission'

// /* eslint-disable import/no-mutable-exports */
// let applicationStore: ApplicationModule
// let authStore: AuthModule
// let characterStore: CharacterModule
// let slideStore: SlideModule
// let blogStore: BlogModule
// let raidStore: RaidModule
// let discordStore: DiscordModule
// let submissionStore: SubmissionModule
// /* eslint-enable import/no-mutable-exports */

// export const storeInitializer: Plugin = ctx => {
//   characterStore = getModule(CharacterModule, ctx.store)
//   characterStore.$axios = ctx.$axios

//   applicationStore = getModule(ApplicationModule, ctx.store)
//   applicationStore.$axios = ctx.$axios

//   authStore = getModule(AuthModule, ctx.store)
//   authStore.$axios = ctx.$axios

//   slideStore = getModule(SlideModule, ctx.store)
//   slideStore.$axios = ctx.$axios

//   blogStore = getModule(BlogModule, ctx.store)
//   blogStore.$axios = ctx.$axios

//   raidStore = getModule(RaidModule, ctx.store)
//   raidStore.$axios = ctx.$axios

//   discordStore = getModule(DiscordModule, ctx.store)
//   discordStore.$axios = ctx.$axios
//   console.log(discordStore)

//   submissionStore = getModule(SubmissionModule, ctx.store)
//   submissionStore.$axios = ctx.$axios
//   console.log(submissionStore)
// }

// export default storeInitializer

// export {
//   submissionStore,
//   applicationStore,
//   authStore,
//   characterStore,
//   slideStore,
//   blogStore,
//   raidStore,
//   discordStore
// }
