'use strict'

const fs = require('fs')
const path = require('path')
const loadConfig = require('../lib/load-config')
const expect = require('chai').expect
const MOCK_CONFIG = require('./fixtures/page.config')

describe('Test load-config', function () {
  it('Test load yaml file', function () {
    let content = fs.readFileSync(path.resolve(__dirname, './fixtures/page.config.yml'), {
      encoding: 'utf-8'
    })
    let result = loadConfig(content, 'yml')
    expect(JSON.stringify(result)).to.equal(JSON.stringify(MOCK_CONFIG))
  })

  it ('Test json file', function () {
    let content = fs.readFileSync(path.resolve(__dirname, './fixtures/page.config.json'), {
      encoding: 'utf-8'
    })
    let result = loadConfig(content, 'json')
    expect(JSON.stringify(result)).to.equal(JSON.stringify(MOCK_CONFIG))
  })
})

