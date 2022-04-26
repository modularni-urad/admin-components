const path = require('path')
// const express = require('express')
const HttpProxy = require('http-proxy-middleware')
const BS = require('browser-sync')
const bs = BS.create()
const SRC_DIR = path.resolve(path.join(__dirname, '..'))
const DEV_DIR = path.resolve(__dirname)
const NODE_MODULES = path.resolve(path.join(__dirname, '../node_modules'))

bs.init({
  server: [ SRC_DIR, DEV_DIR, NODE_MODULES ],
  port: 8080,
  open: false,
  ui: false,
  // middleware: [{
  //   route: '/api',
  //   handle: HttpProxy.createProxyMiddleware({ 
  //     target: 'https://new.otevrenamesta.cz/', 
  //     changeOrigin: true 
  //   })
  // }]
})
bs.watch(DEV_DIR + '/index.html').on('change', bs.reload)
bs.watch(SRC_DIR + '/**/*.js').on('change', function (filepath, file) {
  bs.reload(filepath)
})