/*
 * Tests for Elecal using Mocha, Chai, ChaiAsPromised and Spectron
 */

/*
 * Imports
 */
// This is not necessary for mocha to work but is needed for standardjs to pass
const describe = require('mocha').describe
const it = require('mocha').it
const beforeEach = require('mocha').beforeEach
const afterEach = require('mocha').afterEach

// Actually needed imports for testing
const Application = require('spectron').Application
const path = require('path')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

/*
 * Global variables
 */
// Paths needed for the Application object
const appPath = path.resolve(__dirname, '../app/main.js')
const electronPath = path.resolve(__dirname, '../node_modules/.bin/electron')

// Configure chai before every test
global.before(function () {
  chai.should()
  chai.use(chaiAsPromised)
  this.app = new Application({
    path: electronPath,
    args: [appPath]
  })
})

/*
 * Tests
 */
describe('application launch', function () {
  this.timeout(10000)

  beforeEach(function () {
    return this.app.start()
  })

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })

  it('shows an initial window', function () {
    return this.app.client.waitUntilWindowLoaded()
      .getWindowCount().should.eventually.equal(1)
  })

  it('shows the right title', function () {
    return this.app.client.waitUntilWindowLoaded()
      .getTitle().should.eventually.equal('Elecal')
  })
})

describe('splash', function () {
  this.timeout(10000)

  beforeEach(function () {
    return this.app.start()
  })

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })

  it('shows the unlock button', function () {
    return this.app.client.waitUntilWindowLoaded()
      .element('#unlockBtn').isVisible().should.eventually.be.true
  })

  it('unlock button is a button', function () {
    return this.app.client.waitUntilWindowLoaded()
      .element('#unlockBtn').getTagName().should.eventually.equal('button')
  })
})
