import { computed, ref, watch } from '@nuxtjs/composition-api'
import { clamp } from 'lodash'

interface PaginationOptions {
  /**
   * Total number of items being paginated.
   */
  total: number
  /**
   * Number of items to show per page.
   */
  pageSize?: number
  /**
   * The initial page.
   */
  currentPage?: number
}

export const usePagination = (options: PaginationOptions) => {
  const _currentPage = ref(options.currentPage || 1)
  const _offset = ref(0)
  const pageSize = ref(options.pageSize || 25)
  const total = ref(options.total)

  const offset = computed({
    get() {
      return _offset.value
    },
    set(value: number) {
      _offset.value = Math.min(value, total.value)
    },
  })

  const currentPage = computed({
    get() {
      return _currentPage.value
    },
    set(value: number) {
      _currentPage.value = clamp(value, 1, lastPage.value)
      offset.value = (_currentPage.value - 1) * pageSize.value
    },
  })

  // TODO: Check if this is required, make sure the current page is the correct value
  currentPage.value = _currentPage.value

  const lastPage = computed(() => Math.ceil(total.value / pageSize.value))

  const prev = () => --currentPage.value
  const next = () => ++currentPage.value
  const first = () => (currentPage.value = 1)
  const last = () => (currentPage.value = lastPage.value)

  watch(
    [total, pageSize],
    (_) => {
      if (currentPage.value > lastPage.value) {
        currentPage.value = lastPage.value
      }
    },
    { immediate: false }
  )

  return {
    total,
    pageSize,
    offset,
    currentPage,
    lastPage,
    prev,
    next,
    first,
    last,
  }
}
