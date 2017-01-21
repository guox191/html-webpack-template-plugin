'use strict'

const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')
const Handlebars = require('./lib/handlebars')

let rootPath = process.cwd()
let tplEngine = ['handlebars', 'ejs']

function HtmlWebpackTemplate(options) {
  if (!options.template) {
    this.invalid = true
    console.error('invalid HtmlWebpackTemplate options!')
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
  this.options = options
}

HtmlWebpackTemplate.prototype.apply = function (compiler) {
  if (this.invalid) return
  let _this = this
  let tplContent = ''

  compiler.plugin('make', function (compilation, callback) {
    let tplPath = path.isAbsolute(_this.options.template)
      ? _this.options.template
      : path.join(rootPath, _this.options.template)
    tplContent = fs.readFileSync(tplPath, {
      encoding: 'utf-8'
    })
    callback()
  })

  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-before-html-processing', function (htmlData, cb) {
      let htmlPluginConf = htmlData.plugin.options
      if (htmlPluginConf.disableTemplate) {
        return cb(null, htmlData)
      }

      let tplExtension = (htmlPluginConf.template.match(/\.(\w*)$/) || ['']).pop()
      let htmlConf
      if (tplExtension.match(/ya?ml/)) {
        htmlConf = require('js-yaml').safeLoad(htmlData.html)
      } else if (tplExtension === 'js') {
        htmlConf = require(path.resolve(rootPath, htmlPluginConf.template))
      } else {
        try {
          htmlConf = JSON.parse(htmlData.html)
        } catch (error) {
          htmlConf = {}
        }
      }

      let targetHtml = require(_this.options.engine).compile(tplContent)(htmlConf)
      htmlData.html = targetHtml
      cb(null, htmlData)
    })
  })
}

module.exports = HtmlWebpackTemplate
