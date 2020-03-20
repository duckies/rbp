import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import DiscordModule from '../store/discord'
import RaidModule from '../store/raid'
import BlogModule from '../store/blog'
import SlideModule from '../store/slide'
import CharacterModule from '../store/character'
import UserModule from '../store/user'
import SubmissionStore from '../store/submission'
import FormStore from '../store/form'
import RaiderIOModule from '../store/raiderIO'

/* eslint-disable import/no-mutable-exports */
let userStore: UserModule
let characterStore: CharacterModule
let slideStore: SlideModule
let blogStore: BlogModule
let raidStore: RaidModule
let discordStore: DiscordModule
let submissionStore: SubmissionStore
let formStore: FormStore
let raiderIOStore: RaiderIOModule
/* eslint-enable import/no-mutable-exports */

export function initializeStores(store: Store<unknown>): void {
  submissionStore = getModule(SubmissionStore, store)
  formStore = getModule(FormStore, store)
  characterStore = getModule(CharacterModule, store)
  userStore = getModule(UserModule, store)
  slideStore = getModule(SlideModule, store)
  blogStore = getModule(BlogModule, store)
  raidStore = getModule(RaidModule, store)
  discordStore = getModule(DiscordModule, store)
  raiderIOStore = getModule(RaiderIOModule, store)
}

export {
  userStore,
  characterStore,
  slideStore,
  blogStore,
  raidStore,
  discordStore,
  submissionStore,
  formStore,
  raiderIOStore
}
