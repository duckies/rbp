import { User } from './auth';
import { GetterTree, MutationTree, ActionTree } from 'vuex/types/index';

export interface Application {
  id: number
  fields: any
  characterName: string
  characterRealm: string
  characterRegion: string
  characterData: any;
  author?: User
  // comments?: Comment[]
}

export interface ApplicationState {
  status: string
  errors: Error[],
  application?: Application
  applications: Application[]
}

export const state = (): ApplicationState => ({
  status: 'unloaded',
  errors: [],
  application: undefined,
  applications: []
})

export const getters: GetterTree<ApplicationState, ApplicationState> = {
  application(state: ApplicationState): Application | undefined {
    return state.application
  },
  applications(state: ApplicationState): Application[] {
    return state.applications
  }
}

export const mutations: MutationTree<ApplicationState> = {
  setStatus(state: ApplicationState, status: string): void {
    state.status = status
  },
  addError(state: ApplicationState, error: Error): void {
    state.errors.unshift(error)
  },
  popError(state: ApplicationState): void {
    state.errors.pop()
  },
  setAppliaction(state: ApplicationState, application: Application): void {
    state.application = application
  },
  setAppliactions(state: ApplicationState, applications: Application[]): void {
    state.applications = applications
  },
}

export const actions: ActionTree<ApplicationState, ApplicationState> = {
  async getMyOpenApplication({ commit }): Promise<void> {
    commit('setStatus', 'loading')

    try {
      const resp = await this.$axios.$get('/application/me/open')

      commit('setStatus', 'success')
      commit('setApplication', resp)
    } catch (error) {
      commit('setStatus', 'error')
      commit('addError', error)
    }
  }
}
