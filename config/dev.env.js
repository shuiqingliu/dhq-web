'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
<<<<<<< HEAD
 BASE_API: '"http://10.103.241.66:2140"'
//  BASE_API: '"http://10.128.222.211:2140"'
  //BASE_API: '"http://localhost:8080"' 
  // BASE_API: '"http://10.210.2.104:8080"'
})
=======
  // BASE_API: '"http://localhost:8080"'
  BASE_API: '"http://10.103.241.66:2140"' 
})
>>>>>>> 3a26ecbd615e15671af2de2796037cb43c26e932
