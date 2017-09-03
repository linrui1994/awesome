#!/usr/bin/env node

var shell = require('shelljs')
var cmd = shell.exec('git symbolic-ref --short HEAD')
var message = process.argv[2]
if (cmd.stderr) {
  shell.exit(1)
}
if (!message) {
  console.log('commit message is required')
  shell.exit(1)
}
var branch = cmd.stdout.replace(/\r?\n/, '')
if (branch === 'develop' || branch === 'master') {
  console.log('Do not directly modify the master or develop branch')
  shell.exit(1)
}

if (/working tree clean/.test(shell.exec('git status').stdout)) {
  shell.exit(1)
}
shell.exec(`git add .`)
shell.exec(`git commit -m ${message}`)
var checkout = shell.exec('git checkout develop')
if (/(fatal)|(error)/.test(checkout.stderr + checkout.stdout)) {
  shell.exit(1)
}
var gitpull = shell.exec('git pull origin develop')
if (/(fatal)|(error)/.test(gitpull.stderr + gitpull.stdout)) {
  shell.exit(1)
}
shell.exec(`git checkout ${branch}`)
var rebase = shell.exec('git rebase develop')
if (/(fatal)|(error)/.test(rebase.stdout + rebase.stderr)) {
  shell.exit(1)
}
shell.exec(`git push origin ${branch}`)
console.log('done') 