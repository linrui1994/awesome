#!/usr/bin/env node

var qrcode = require('qrcode-terminal')
var ip = require('quick-local-ip').getLocalIP4()
var msg = process.argv[2] || `http://${ip}:8080`

qrcode.generate(msg, function (qrcode) {
    console.log(qrcode)
})
