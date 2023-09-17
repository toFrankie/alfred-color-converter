const {init} = require('@ifanrx/eslint-config-standard/init')

module.exports = init({
  root: true,
  extends: '@ifanrx/standard',
  rules: {
    'no-console': 0,
  },
})
