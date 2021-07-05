import { computed, reactive } from '@nuxtjs/composition-api'

export enum StateStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
}

export function useState() {
  const state = reactive({
    tasks: [] as string[],
  })

  const status = computed(() => (state.tasks.length ? StateStatus.LOADING : StateStatus.IDLE))

  const isLoading = computed(() => !!state.tasks.length)

  const isLoadingFor = (t: string | string[]) => {
    if (Array.isArray(t)) {
      return t.every((task) => state.tasks.includes(task))
    }

    return state.tasks.includes(t)
  }

  const start = (task: string) => state.tasks.push(task)

  const end = (task: string) => (state.tasks = state.tasks.filter((t) => t !== task))

  const wait = async <T>(task: string, cb: Promise<T> | (() => Promise<T>)) => {
    try {
      start(task)

      if (typeof cb === 'function') {
        return await cb()
      } else {
        return await cb
      }
    } finally {
      end(task)
    }
  }

  return {
    status,
    isLoading,
    isLoadingFor,
    wait,
    start,
    end,
  }
}
