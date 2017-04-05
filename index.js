'use strict'

const path = require('path')
const fs = require('fs')
const loadConfig = require('./lib/load-config')
const tplEngine = ['handlebars', 'ejs']
let rootPath = process.cwd()

function HtmlWebpackTemplate(options) {
  if (!options.template) {
    throw new Error('No `template` option found')
  }
  if (options.root) {
    let optionRoot = options.root
    rootPath = path.isAbsolute(optionRoot) ? optionRoot : path.resolve(__dirname, optionRoot)
  }
  if (!options.engine || tplEngine.indexOf(options.engine.toLowerCase()) === -1) {
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
  this.externalHelpers = options.helper || {}
  this.configFilter = options.filter
}

HtmlWebpackTemplate.prototype.apply = function (compiler) {
  const _this = this
  let htmlTpl = ''

  compiler.plugin('make', function (compilation, callback) {
    let tplPath = path.isAbsolute(_this.options.template)
      ? _this.options.template
      : path.join(rootPath, _this.options.template)
    fs.readFile(tplPath, {
      encoding: 'utf-8'
    }, function (error, data) {
      if (error) throw error
      htmlTpl = data
      callback()
    })
  })

  compiler.plugin('compilation', function (compilation) {
    let htmlPluginConf = {}

    compilation.plugin('html-webpack-plugin-before-html-processing', function (pluginArgs, cb) {
      htmlPluginConf = pluginArgs.plugin.options
      if (htmlPluginConf.disableTemplate) {
        return cb(null, pluginArgs)
      }

      let configType = (htmlPluginConf.template.match(/\.(\w*)$/) || ['']).pop()
      let variables
      try {
        variables = loadConfig(pluginArgs.html, configType)
        let filter = htmlPluginConf.filter || _this.configFilter
        if (filter) {
          variables = filter(variables, htmlPluginConf)
        }
      } catch (error) {
        error.message = htmlPluginConf.filename + ': ' + error.message
        throw error
      }

      const engine = require('./lib/engines/' + _this.options.engine)
      Object.keys(_this.externalHelpers).forEach(name => {
        if (typeof _this.externalHelpers[name] === 'function') {
          engine.registerHelper(name, _this.externalHelpers[name])
        }
      })

      variables = Object.assign({}, _this.variableMap, variables)
      let targetHtml = engine.compile(htmlTpl)(variables)
      pluginArgs.html = targetHtml

      cb(null, pluginArgs)
    })

    compilation.plugin('html-webpack-plugin-alter-asset-tags', function (pluginArgs, cb) {
      if (htmlPluginConf.disableTemplate) {
        return cb(null, pluginArgs)
      }

      let scriptAttrs = htmlPluginConf.scriptAttribute
      if (scriptAttrs && typeof scriptAttrs === 'object') {
        pluginArgs.body.forEach(item => {
          if (item.tagName === 'script') {
            Object.assign(item.attributes, scriptAttrs)
          }
        })
      }
      cb(null, pluginArgs)
    })
  })
}

module.exports = HtmlWebpackTemplate
