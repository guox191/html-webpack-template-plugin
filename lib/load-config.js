'use strict'

module.exports = function (content, fileType) {
  if (!content && typeof content === 'object') {
    return content
  }
  let config
  if (fileType.match(/ya?ml/)) {
    config = require('js-yaml').safeLoad(content)
  } else if (fileType === 'js') {
    // TODO
  } else {
    try {
      config = JSON.parse(content)
    } catch (error) {
      config = {}
    }
  }

  return config
}

