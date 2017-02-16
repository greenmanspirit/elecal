/*
 * This script contains the code for the Electron Renderer process for the app's
 *   preferences window. It also uses React to create the user interface and
 *   respond to interface events.
 */

/*
 * Imports
 */

// Node.js imports that will not work with browserify require
const ipc = window.require('electron').ipcRenderer

// Load jQuery and set globals for bootstrap, then load boostrap
const $ = require('jquery')
global.$ = $
global.jQuery = $
require('bootstrap')

// Imports that work with browserify require
const _ = require('lodash')
const React = require('react')
const ReactDOM = require('react-dom')
const validUrl = require('valid-url')

// Import all of our React components
let Toolbar = require('./components/Toolbar')
let Accounts = require('./components/Accounts')
let Account = require('./components/Account')
let AddAccount = require('./components/AddAccount')

/*
* React Code
*/
let PreferencesInterface = React.createClass({
  /*
   * React lifecycle methods
   */
  // Set the initial state of the application
  getInitialState: function () {
    let accounts = ipc.sendSync('getAccounts')
    return {
      accounts: accounts,
      showAddAccount: false,
      showAccounts: true
    }
  }, // getInitialState

  // Toggles the visibility of the AddAccount modal
  toggleAddAccount: function () {
    let tempAdd = !this.state.showAddAccount
    let tempAccts = !this.state.showAccounts
    this.setState({
      showAddAccount: tempAdd,
      showAccounts: tempAccts
    }) // setState
  }, // toggleUnlockDisplay

  // Adds a new account
  addAccount: function (values) {
    if (validUrl.isWebUri(values.server)) {
      let tmpAccounts = this.state.accounts
      tmpAccounts.push(values)
      this.setState({
        accounts: tmpAccounts,
        showAddAccount: false,
        showAccounts: true
      }) // setState
      ipc.send('saveAccounts', tmpAccounts)
    } else {
      this.setState({
        showInvalidServerError: true
      })
    }// if valid url
  }, // addAccount

  // Deletes an account
  deleteAccount: function (account) {
    let tmpAccounts = this.state.accounts
    tmpAccounts = _.without(tmpAccounts, account)
    this.setState({
      accounts: tmpAccounts
    }) // setState
    ipc.send('saveAccounts', tmpAccounts)
  }, // deleteAccount

  render: function () {
    // Dislay/Hide AddAccount modal and set focus on the name field
    if (this.state.showAddAccount === true) {
      // If we have an error, show it
      if (this.state.showInvalidServerError === true) {
        $('#invalidServerError').show()
      }
      $('#addAccount').css('display', 'block')
      $('#name').focus()
    } else {
      $('#addAccount').css('display', 'none')
    }

    // Display/Hide Accounts Component
    if (this.state.showAccounts === true) {
      $('#accounts').css('display', 'block')
    } else {
      $('#accounts').css('display', 'none')
    }

    // Build out the account list using the Account component
    let accounts = this.state.accounts
    accounts = accounts.map(function (account, index) {
      return (
        <Account
          key={index}
          account={account}
          deleteAccount={this.deleteAccount}
        />
      ) // return
    }.bind(this)) // accounts.map

    return (
      <div className='application container-fluid'>
        <div className='row'>
          <div className='col-xs-3 alpha omega'>
            <Toolbar />
          </div>
          <div className='col-xs-9 alpha omega'>
            <AddAccount
              toggleAddAccount={this.toggleAddAccount}
              addAccount={this.addAccount}
            />
            <Accounts
              accounts={accounts}
              toggleAddAccount={this.toggleAddAccount}
            />
          </div>
        </div>
      </div>
    ) // return
  } // render
}) // PreferencesInterface

// Place the MainInterface component in the DOM
ReactDOM.render(
  <PreferencesInterface />,
  document.getElementById('preferences')
) // render
