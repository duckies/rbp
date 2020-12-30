export enum Status {
  UNLOADED = 'unloaded',
  LOADING = 'loading',
  IDLE = 'idle',
  ERROR = 'error'
}

export interface BaseState {
  status: Status,
}