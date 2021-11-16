'use strict'

const {register} = require('esbuild-register/dist/node')

const {unregister} = register({
  externals: ['tslib'],
})

// Unregister the require hook if you don't need it anymore
// unregister()
