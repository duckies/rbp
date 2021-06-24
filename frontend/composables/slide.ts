import { reactive, useContext, useFetch } from '@nuxtjs/composition-api'
import { Slide } from '../interfaces/entities.interface'
import { useState } from './state'

export function useSlides() {
  const { isLoading, wait, start, end } = useState()
  const { $axios } = useContext()
  const state = reactive({
    slides: [] as Slide[],
  })

  const { fetch: getSlides, fetchState: getSlideStatus } = useFetch(async () => {
    const resp = await wait('/slide', $axios.$get('/slide'))
    state.slides = resp
  })

  return {
    slides: state.slides,
    getSlides,
    getSlideStatus,
    isLoading,
  }
}
