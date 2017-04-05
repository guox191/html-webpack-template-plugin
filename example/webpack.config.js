'use strict'

const webpack = require('webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')
const htmlTemplatePlugin = require('..')
const path = require('path')
const CONFIG_TYPE = process.env.CONFIG_TYPE || 'yml'
const ROOT_PATH = __dirname
const DIST_PATH = path.join(ROOT_PATH, 'dist')
const ENTRY_PAGE = [
  {
    chunkName: 'page1',
    src: './page1',
    chunks: []
  }, {
    chunkName: 'page2',
    src: './page2',
    chunks: []
  }
]
const MINIFY_OPTION = {
  removeComments: true,
  collapseWhitespace: true,
  minifyJS: true,
  minifyCSS: true,
  collapseBooleanAttributes: true
}

function testFilter(config) {
  return config.template
}

let entryHtmlPlugins = ENTRY_PAGE.map(item => new htmlWebpackPlugin({
  filename: `${item.chunkName}/index.html`,
  template: `${item.src}/config.${CONFIG_TYPE}`,
  minify: MINIFY_OPTION,
  chunks: ['common', item.chunkName].concat(item.chunks),
  scriptAttribute: {
    crossorigin: 'anonymous',
    defer: true
  },
  filter: item.chunkName === 'page1' ? testFilter : null,
}))

module.exports = {
  entry: {
    common: ['./common.js'],
    page1: './page1/index.js',
    page2: './page2/index.js'
  },
  output: {
    path: DIST_PATH,
    filename: '[name].[chunkhash:7].js'
  },
  plugins: entryHtmlPlugins.concat([
    new htmlTemplatePlugin({
      root: __dirname,
      template: './index.ejs',
      engine: 'ejs',
      variable: {
        'preInjected': 'This variable was injected from plugin definition',
        'testArray': [
          'test1',
          'test2'
        ]
      },
      helper: {
        script: value => {
          if (!value || !Array.isArray(value)) {
            return ''
          }
          let result = ''
          value.forEach(item => {
            if (typeof item === 'string') {
              item = { src: item, }
            }
            if (item !== null && typeof item === 'object') {
              item.crossorigin = 'anonymous'
              result += '<script'
              Object.keys(item).forEach(key => {
                result += ' ' + (item[key] ? (key + '="' + item[key] + '"') : key)
              })
              result += '></script>'
            }
          })
          return result
        }
      },
    })
  ])
}
