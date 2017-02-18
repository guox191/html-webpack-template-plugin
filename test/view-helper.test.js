'use strict'

const expect = require('chai').expect
const Helper = require('../lib/view-helper')

describe('Test lib/view-helper', () => {
  it('Test metaTag method', () => {
    let metaList = [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width' }
    ]
    let result = '<meta charset="utf-8"><meta name="viewport" content="width=device-width">'
    expect(Helper.metaTag(metaList)).to.equal(result)
  })

  it('Test scriptTag method', () => {
    let scripts = [
      './app.js',
      { src:'./admin.js', crossorigin: 'anonymous' }
    ]
    let result = '<script src="./app.js"></script><script src="./admin.js" crossorigin="anonymous"></script>'
    expect(Helper.scriptTag(scripts)).to.equal(result)
  })
})

