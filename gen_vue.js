#!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var fileName = process.argv[2]
var filePath
var template =
`<template>
  <div>
    
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  created () {
    // TODO
  },
  methods: {
    // TODO
  }
}
</script>
<style lang='scss'>

</style>
`
if (!fileName) {
  console.log(`
    vue文件名必填
    usage: npm run gen_vue index.vue src/components
  `)
  process.exit()
}
if ((/\./.test(fileName) && !/\.vue$/.test(fileName)) || (/\.(.*)\./.test(fileName))) {
  console.log('文件格式不对，文件后缀必须为.vue或不写')
  process.exit()
}
if (!/\.vue$/.test(fileName)) {
  fileName += '.vue'
}

function getProjectPath (currPath) {
  console.log(currPath)
  if (currPath === '/') {
    console.log('can not get the project')
    process.exit()
  } else {
    try {
      var list = fs.readdirSync(currPath)
      if (list.filter(item => item === '.babelrc' || item === '.eslintrc.js' || item === 'package.json').length === 3) {
        filePath = path.resolve(currPath, process.argv[3] || 'src/components')
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
  console.log(filePath)
  fs.readdirSync(filePath)
} catch (err) {
  console.log('目录不存在 自动创建')
  fs.mkdirSync(filePath)
}
try {
  fs.statSync(`${filePath}/${fileName}`)
  console.log(`文件已存在 --- ${filePath}/${fileName}`)
  process.exit()
} catch (err) {
  fs.writeFile(`${filePath}/${fileName}`, template, 'utf-8', function (err) {
    if (err) {
      throw err
    }
    console.log(`创建成功 --- ${filePath}/${fileName}`)
  })
}
