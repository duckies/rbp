import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import DiscordModule from '../store/discord'
import RaidModule from '../store/raid'
import BlogModule from '../store/blog'
import SlideModule from '../store/slide'
import CharacterModule from '../store/character'
import AuthModule from '../store/auth'
import SubmissionStore from '../store/submission'
import FormStore from '../store/form'

/* eslint-disable import/no-mutable-exports */
let authStore: AuthModule
let characterStore: CharacterModule
let slideStore: SlideModule
let blogStore: BlogModule
let raidStore: RaidModule
let discordStore: DiscordModule
let submissionStore: SubmissionStore
let formStore: FormStore
/* eslint-enable import/no-mutable-exports */

export function initializeStores(store: Store<unknown>): void {
  submissionStore = getModule(SubmissionStore, store)
  formStore = getModule(FormStore, store)
  characterStore = getModule(CharacterModule, store)
  authStore = getModule(AuthModule, store)
  slideStore = getModule(SlideModule, store)
  blogStore = getModule(BlogModule, store)
  raidStore = getModule(RaidModule, store)
  discordStore = getModule(DiscordModule, store)
}

export { authStore, characterStore, slideStore, blogStore, raidStore, discordStore, submissionStore, formStore }
