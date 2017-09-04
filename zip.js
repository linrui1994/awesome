#!/usr/bin/env node

require('shell/global')
var path = process.cwd()
var names = path.split('/')
var name = process.argv[2] || path.split('/').filter((item ,index, arr) => index === arr.length-1)[0]
var where = process.argv[3] || path

exec(`zip -r ${name} ${where}`)
console.log('done')
