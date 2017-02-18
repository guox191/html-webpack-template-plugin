'use strict'

const ejs = require('ejs')
const Helper = require('../view-helper')

let helpers = {
  default: (value, other) => value || other,
  meta: value => Helper.metaTag(value),
  script: value => Helper.metaTag(value)
}

let _compile = ejs.compile
ejs.compile = (template, opts) => config => {
  config._ = helpers
  return _compile.call(ejs, template, opts)(config)
}

module.exports = ejs

