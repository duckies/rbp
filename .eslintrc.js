module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  extends: [
    '@nuxtjs',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'prettier',
    'prettier/vue',
    'plugin:nuxt/recommended'
  ],
  plugins: ['@typescript-eslint'],
  // add your custom rules here
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'no-explicit-any': 'off',
    '@typescript-eslint/camelcase': 'off'
  },
  overrides: [
    {
      // The auth config uses camel case not within our control.
      files: ['nuxt.config.ts', 'nuxt.config.js'],
      rules: { '@typescript-eslint/camelcase': 'off' }
    }
  ]
}
