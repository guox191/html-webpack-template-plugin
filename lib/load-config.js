'use strict'
/**
 * Parse template config
 * @param {String} content raw text from config file
 * @param {String} file type of config file
 * @return {Object} config object
 * @Exception {SyntaxError} throwed when loads a invalid file
 */
module.exports = function (content, fileType) {
  if (!content && typeof content === 'object') return content

  return /ya?ml/.test(fileType) ?
    require('js-yaml').safeLoad(content) :
    JSON.parse(content)
}

