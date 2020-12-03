module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    // 'no-useless-cast': 'error',
    // 'import/order': 'error',
    // 'import/extensions': 'off',
    // 'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    // 'class-methods-use-this': 'off',
    // 'no-plusplus': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prefer-const': ['error', { destructuring: 'all' }],
    '@typescript-eslint/no-inferrable-types': 'warn',
    // 'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/*spec.ts'] }],
    // 'no-useless-constructor': 'off',
    // '@typescript-eslint/no-useless-constructor': 'error',
  },
  overrides: [
    {
      files: ['*.entity.ts'],
      rules: {
        // MikroORM requires explicit type definitions.
        '@typescript-eslint/no-inferrable-types': 'off',
      },
    },
  ],
};
