'use strict'

module.exports = {
  metaTag: value => {
    if (!value || !Array.isArray(value)) {
      return ''
    }
    let result = ''
    value.forEach(meta => {
      result += '<meta'
      Object.keys(meta).forEach(attr => {
        result += (' ' + attr + '="' + meta[attr] + '"')
      })
      result += '>'
    })
    return result
  },
  scriptTag: value => {
    if (!value || !Array.isArray(value)) {
      return ''
    }
    let result = ''
    value.forEach(item => {
      if (typeof item === 'string') {
        result += ('<script src="' + item + '"></script>')
      } else if (item !== null && typeof item === 'object') {
        result += '<script'
        Object.keys(item).forEach(key => {
          result += ' ' + (item[key] ? (key + '="' + item[key] + '"') : key)
        })
        result += '></script>'
      }
    })
    return result
  }
}
