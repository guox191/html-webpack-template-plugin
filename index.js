'use strict'

const path = require('path')
const fs = require('fs')
const loadConfig = require('./lib/load-config')

let rootPath = process.cwd()
let tplEngine = ['handlebars', 'ejs']

function HtmlWebpackTemplate(options) {
  if (!options.template) {
    throw new Error('No `template` option found')
  }
  if (options.root) {
    let optionRoot = options.root
    rootPath = path.isAbsolute(optionRoot) ? optionRoot : path.resolve(__dirname, optionRoot)
  }
  if (!options.engine && String(tplEngine).toLowerCase().indexOf(options.engine) === -1) {
    options.engine = tplEngine[0]
  } else {
    options.engine = options.engine.toLowerCase()
  }
  this.options = {
    template: options.template,
    root: options.root,
    engine: options.engine
  }
  this.variableMap = options.variable || {}
}

HtmlWebpackTemplate.prototype.apply = function (compiler) {
  let _this = this
  let tplContent = ''

  compiler.plugin('make', function (compilation, callback) {
    let tplPath = path.isAbsolute(_this.options.template)
      ? _this.options.template
      : path.join(rootPath, _this.options.template)
    fs.readFile(tplPath, {
      encoding: 'utf-8'
    }, function (error, data) {
      if (error) throw error
      tplContent = data
      callback()
    })
  })

  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-before-html-processing', function (htmlData, cb) {
      let htmlPluginConf = htmlData.plugin.options
      if (htmlPluginConf.disableTemplate) {
        return cb(null, htmlData)
      }
      let tplExtension = (htmlPluginConf.template.match(/\.(\w*)$/) || ['']).pop()
      let htmlConf
      try {
        htmlConf = loadConfig(htmlData.html, tplExtension)
      } catch (error) {
        error.message = htmlPluginConf.filename + ': ' + error.message
        throw error
      }
      htmlConf = Object.assign(htmlConf, _this.variableMap)
      let targetHtml = require('./lib/' + _this.options.engine).compile(tplContent)(htmlConf)
      htmlData.html = targetHtml
      cb(null, htmlData)
    })
  })
}

module.exports = HtmlWebpackTemplate

