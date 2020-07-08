import Vue from 'vue'
// TODO: Replace this library or the slider altogether, bad UX all around.
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import Flickity from 'vue-flickity'
import 'flickity-bg-lazyload'

Vue.component('flickity', Flickity)
