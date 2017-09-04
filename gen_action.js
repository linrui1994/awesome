#!/usr/bin/env node

var path = require('path')
var fs = require('fs')
var actionPath = path.resolve(process.cwd(), 'src/store/actions.js')
var action = process.argv[2]
if (!action) {
  console.log(`
    action 方法名必填
    usage: npm run gen_action getList
  `)
  process.exit()
}
var template =
`
// generate from npm run gen_action ${action}
export const ${action} = ({commit}, params) => {
  return new Promise((resolve, reject) => {
    api.${action}(params).then(res => {
      if (res.success) {
        // TODO
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(reject)
  })
}
`
function getProjectPath (currPath) {
  if (currPath === '/') {
    console.log('can not get the project')
    process.exit()
  } else {
    try {
      var list = fs.readdirSync(currPath)
      if (list.filter(item => item === '.babelrc' || item === '.eslintrc.js' || item === 'package.json').length === 3) {
        actionPath = path.resolve(currPath, 'src/store/actions.js')
      } else {
        getProjectPath(path.resolve(currPath, '../'))
      }
    } catch (err) {
      throw err
    }
  }
}
getProjectPath(process.cwd())
try {
  fs.readFile(actionPath, 'utf-8', function (err, data) {
    if (err) {
      throw err
    }
    if (new RegExp(`(export const ${action})|(export function ${action})`).test(data)) {
      console.log(`${action}已存在`)
      process.exit()
    } else {
      fs.writeFile(actionPath, data += template, 'utf-8', function (err) {
        if (err) {
          throw err
        }
        console.log(`generate ${action} succeed!`)
      })
    }
  })
} catch (err) {
  throw err
}
