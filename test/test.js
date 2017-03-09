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

process.env.HOME = path.resolve(__dirname)
var configPath = path.join(process.env.HOME, '.config', 'elecal')
var accountConfig = path.join(configPath, 'accounts')
const fs = require('fs')
const assert = require('assert')

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

describe('Splash', function () {
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

describe('UnlockAccounts', function () {
  this.timeout(10000)

  beforeEach(function () {
    if (fs.existsSync(accountConfig)) {
      fs.unlinkSync(accountConfig)
    }
    return this.app.start()
  })

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })

  it('form should show', function () {
    return this.app.client.waitUntilWindowLoaded()
      .click('//*[@id="unlockBtn"]')
      .waitForVisible("//*[@id='unlockAccounts']", 5000).should.eventually.be.true
  })

  // This app creates an encryped accounts config file with the password the
  //   user enters the first time they run the app.
  it('should create account config on initial unlock', function () {
    this.app.client.waitUntilWindowLoaded()
      .click('//*[@id="unlockBtn"]')
      .waitForVisible("//*[@id='unlockAccounts']", 5000)
      .setValue('//*[@id="password"]', 'password')
      .click('//*[@id="unlockAccounts"]/div/div/form/div[2]/div/div/button[2]')
      .waitForVisible('//*[@id="unlockAccounts"]', 5000, true)
      .then(function () {
        if (fs.existsSync(accountConfig)) {
          assert(true)
        } else {
          assert.fail(false, true, 'Config file not created')
        }
      })
  })

  it('should show error on bad password', function () {
    fs.writeFileSync(accountConfig, '8n=')
    return this.app.client.waitUntilWindowLoaded()
      .click('//*[@id="unlockBtn"]')
      .waitForVisible('//*[@id="unlockAccounts"]', 5000)
      .setValue('//*[@id="password"]', 'badPass')
      .click('//*[@id="unlockAccounts"]/div/div/form/div[2]/div/div/button[2]')
      .waitForVisible('//*[@id="unlockError"]', 5000).should.eventually.be.true
  })
})
