'use strict'

const webpack = require('webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')
const htmlTemplatePlugin = require('..')
const path = require('path')
const ROOT_PATH = __dirname
const DIST_PATH = path.join(ROOT_PATH, 'dist')
const entryPages = [
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

let entryHtmlPlugins = entryPages.map(item => new htmlWebpackPlugin({
  filename: `${item.chunkName}/index.html`,
  template: `${item.src}/index.yml`,
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
      engine: 'handlebars'
    })
  ])
}

