'use strict'

const Helper = require('../view-helper')
const Handlebars = require('handlebars')

Handlebars.registerHelper('default', (value, other) => value || other)

Handlebars.registerHelper('meta', value => Helper.metaTag(value))

Handlebars.registerHelper('script', value => Helper.scriptTag(value))

module.exports = Handlebars

