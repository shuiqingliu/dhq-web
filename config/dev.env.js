'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //BASE_API: '"http://localhost:2140"'
  //孙佳林后台地址
  // BASE_API: '"http://10.210.2.104:2140"' 
 // BASE_API: '"http://60.205.167.19:8075"' 
  BASE_API: '"http://10.103.250.120:2140"' 
  // BASE_API: '"http://192.168.43.146:2140"'
})
