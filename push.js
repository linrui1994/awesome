#!/usr/bin/env node

require('shelljs/global')
var cmd = exec('git symbolic-ref --short HEAD')
var message = process.argv[2]
if (cmd.stderr) {
  exit(1)
}
if (!message) {
  console.log('commit message is required')
  exit(1)
}
var branch = cmd.stdout.replace(/\r?\n/, '')
if (branch === 'develop' || branch === 'master') {
  console.log('Do not directly modify the master or develop branch')
  exit(1)
}

exec(`git add .`)
exec(`git commit -m ${message}`)

var checkout = exec('git checkout develop')
if (/(fatal)|(error)/.test(checkout.stderr + checkout.stdout)) {
  exit(1)
}
var gitpull = exec('git pull origin develop')
if (/(fatal)|(error)/.test(gitpull.stderr + gitpull.stdout)) {
  exit(1)
}
exec(`git checkout ${branch}`)
var rebase = exec('git rebase develop')
if (/(fatal)|(error)/.test(rebase.stdout + rebase.stderr)) {
  exit(1)
}
exec(`git push origin ${branch}`)
console.log('done')
