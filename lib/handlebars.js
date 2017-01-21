'use strict'

const Handlebars = require('handlebars')

Handlebars.registerHelper('config', function (value, defaultValue) {
  return value || defaultValue
})

Handlebars.registerHelper('metaTag', function (value) {
  if (!value) return ''
  let allMeta = ''
  value.forEach(meta => {
    let tagString = '<meta'
    Object.keys(meta).forEach(attr => {
      tagString += (' ' + attr + '="' + meta[attr] + '"')
    })
    tagString += '>'
    allMeta += tagString
  })
  return allMeta
})

module.exports = Handlebars

