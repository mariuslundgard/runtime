'use strict'

const base = require('./base')

module.exports = {
  ...base,
  env: {
    ...base.env,
    browser: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: base.plugins.concat(['jsx-a11y', 'react', 'react-hooks']),
  rules: {
    ...base.rules,
    'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react/no-unescaped-entities': 0,
  },
  settings: {react: {version: 'detect'}},
}
