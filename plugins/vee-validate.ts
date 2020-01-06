import { extend } from 'vee-validate'
import { required } from 'vee-validate/dist/rules'

/**
 * This file imports the necessary field validators
 * for the Vee-Validate plugin.
 */

extend('required', {
  ...required,
  message: 'This field is required.'
})
