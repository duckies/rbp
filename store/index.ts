import { Store } from 'vuex'
import { initializeStores } from '~/utils/store-accessor.ts'

const initializer = (store: Store<unknown>): void => initializeStores(store)
export const plugins = [initializer]
export * from '~/utils/store-accessor'
