'use strict'

const Handlebars = require('handlebars')

Handlebars.registerHelper('config', function (value, defaultValue) {
  return value || defaultValue
})

Handlebars.registerHelper('metaTag', function (value) {
  console.log(value)
  let tagString = '<meta'
  Object.keys(value).forEach(key => {
    tagString += (' ' + key + '="' + value[key] + '"')
  })
  return tagString + '>'
})

module.exports = Handlebars

