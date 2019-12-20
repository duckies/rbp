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
    'prefer-const': ['error', { destructuring: 'all' }],
    // 'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/*spec.ts'] }],
    // 'no-useless-constructor': 'off',
    // '@typescript-eslint/no-useless-constructor': 'error',
  },
};
