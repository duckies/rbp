import { extend } from 'vee-validate'
import { required, oneOf } from 'vee-validate/dist/rules'

/**
 * This file imports the necessary field validators
 * for the Vee-Validate plugin.
 */

extend('required', {
  ...required,
  message: 'This field is required.',
})

extend('oneOf', {
  ...oneOf,
  message: 'Please select a valid option.',
})
