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

let entryHtmlPlugins = ENTRY_PAGE.map(item => new htmlWebpackPlugin({
  filename: `${item.chunkName}/index.html`,
  template: `${item.src}/config.${CONFIG_TYPE}`,
  minify: MINIFY_OPTION,
  chunks: ['common', item.chunkName].concat(item.chunks)
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
      template: './index.hbs',
      engine: 'handlebars',
      variable: {
        'preInjected': 'This variable was injected from plugin definition',
        'testArray': [
          'test1',
          'test2'
        ]
      }
    })
  ])
}

