'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '" http://10.103.241.66:2140"'
  //BASE_API: '"http://localhost:8080"' 
})
