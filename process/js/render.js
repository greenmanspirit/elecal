/*
 * This script contains the code for the Electron Renderer process. It also uses
 *   React to create the user interface and respond to interface events.
 */

/*
 * Imports
 */
// Node.js imports that will not work with browserify require
const path = window.require('path');
const fs = window.require('fs');
const ipc = window.require('electron').ipcRenderer;
const crypto = window.require('crypto');

// Imports that work with browserify require
const $ = jQuery = require('jquery');
const _ = require('lodash');
const bootstrap = require('bootstrap');
const React = require('react');
const ReactDOM = require('react-dom');
const validUrl = require('valid-url')

// Import all of our React components
let UnlockAccounts = require('./components/UnlockAccounts');
let Splash = require('./components/Splash');
let Accounts = require('./components/Accounts');
let Account = require('./components/Account');
let AddAccount = require('./components/AddAccount');

/*
 * Config file management
 */
let config_path = ipc.sendSync('getConfigDir');
let account_config = path.join(config_path, 'accounts');

// Load Accounts from encrypted config file
function loadAccounts(password) {
  let encrypted_accounts = fs.readFileSync(account_config, {encoding: 'utf8'});
  let decipher = crypto.createDecipher('aes-256-ctr', password)
  let accounts = decipher.update(encrypted_accounts, 'base64', 'utf8')
  accounts += decipher.final('utf8');
  try {
    return JSON.parse(accounts);
  } catch (err) {
    return false;
  }
} //loadAccounts

// Save Accounts to encrypted config file
function saveAccounts(password, accounts) {
  let cipher = crypto.createCipher('aes-256-ctr', password);
  let encrypted_accounts = cipher.update(JSON.stringify(accounts), 'utf8', 'base64');
  encrypted_accounts += cipher.final('base64');
  fs.writeFileSync(account_config, encrypted_accounts, {encoding: 'utf8'});
} //saveAccounts

/*
 * React Code
 */
let MainInterface = React.createClass({
  /*
   * React lifecycle methods
   */
  // Set the initial state of the application
  getInitialState: function() {
    return {
      password: '',
      accounts: [],
      showUnlockAccounts: false,
      showAddAccount: false,
      showSplash: true,
      showAccounts: false
    }
  }, //getInitialState

  // Component has loaded but has not rendered
  componentDidMount: function() {
    // This event shows/hides the Account component. This is here to be
    //   triggered by the main process when a user selects the 'Accounts' menu
    //   option.
    ipc.on('showAccounts', function(event, message) {
      this.toggleAccounts();
    }.bind(this)); //showAccounts
  }, //componentDidMount

  // Toggles the visibility of the UnlockAccounts modal
  toggleUnlockAccounts: function() {
    let temp = !this.state.showUnlockAccounts;
    this.setState({
      showUnlockAccounts: temp
    }); //setState
  }, //toggleUnlockDisplay

  // Toggles the visibility of the AddAccount modal
  toggleAddAccount: function() {
    let temp = !this.state.showAddAccount;
    this.setState({
      showAddAccount: temp
    }); //setState
  }, //toggleUnlockDisplay

  // Toggles the visibility of the Accounts component
  toggleAccounts: function() {
    let temp = !this.state.showAccounts;
    this.setState({
      showAccounts: temp
    }); //setState
  }, //toggleAccounts

  // This function takes care of unlocking the application. The unlock is there
  //   for security. You can only load the account config file with the password
  //   gathered here as that password is the encryption key for the config file.
  unlockAccounts: function(password) {
    // Test to see if the file can be written and read.
    fs.access(account_config, fs.constants.R_OK | fs.constants.W_OK, function(err) {
      let tmpAccounts = this.state.accounts;
      // If there is an error, try creating the config file.
      if(err) {
        // Encrypt tmpAccounts and encode at base64
        let cipher = crypto.createCipher('aes-256-ctr', password);
        let crypted = cipher.update(JSON.stringify(tmpAccounts), 'utf8', 'base64');
        crypted += cipher.final('base64');
        // Open account_config with 'w' and mode 0o600 so we can create the
        //   initial config file for the user. Since this is config data, I use
        //   writeSync.
        fs.open(account_config, 'w', 0o600, function(err, fd) {
          fs.writeSync(fd, crypted);
          fs.close(fd);
        }); //fs.open
      } else {
        // There wasn't an error, so lets load the acccounts
        tmpAccounts = loadAccounts(password);
      }
      if(tmpAccounts === false) {
        this.setState({
          showUnlockError: true
        })
      } else {
        // Set the post unlock state
        this.setState({
          accounts: tmpAccounts,
          password: password,
          showUnlockAccounts: false,
          showSplash: false
        }); //setState
      }
    }.bind(this)); //fs.access
  }, //unlockAccounts

  // Adds a new account
  addAccount: function(values) {
    console.log(values.server);
    if(validUrl.isWebUri(values.server)) {
      let tmpAccounts = this.state.accounts;
      tmpAccounts.push(values);
      this.setState({
        accounts: tmpAccounts,
        showAddAccount: false
      }); //setState
      saveAccounts(this.state.password, tmpAccounts);
    } else {
      this.setState({
        showInvalidServerError: true
      })
    }//if valid url
  }, //addAccount

  // Deletes an account
  deleteAccount: function(account) {
    let tmpAccounts = this.state.accounts;
    tmpAccounts = _.without(tmpAccounts, account);
    this.setState({
      accounts: tmpAccounts
    }); //setState
    saveAccounts(this.state.password, tmpAccounts);
  }, //deleteAccount

  // Renders the component
  render: function() {
    /*
     * Display/Hide components/modals with jQuery
     */
    // Display/Hide UnlockAccounts modal and set focus on the password field
    if(this.state.showUnlockAccounts === true) {
      // If we have an error, show it
      if(this.state.showUnlockError === true) {
        $('#unlockError').show();
      }
      $('#unlockAccounts').on('shown.bs.modal', function() {
        $('#password').focus();
      });
      $('#unlockAccounts').modal('show');
    } else {
      $('#unlockAccounts').modal('hide');
    }

    // Dislay/Hide AddAccount modal and set focus on the name field
    if(this.state.showAddAccount === true) {
      // If we have an error, show it
      if(this.state.showInvalidServerError === true) {
        $('#invalidServerError').show();
      }
      $('#addAccount').modal('show');
      $('#addAccount').on('shown.bs.modal', function() {
        $('#name').focus();
      });
    } else {
      $('#addAccount').modal('hide');
    }

    // Dislay/Hide Splash Component
    if(this.state.showSplash === true) {
      $('#splash').css('display', 'block');
    } else {
      $('#splash').css('display', 'none');
    }

    // Display/Hide Accounts Component
    if(this.state.showAccounts === true) {
      $('#accounts').css('display', 'block');
    } else {
      $('#accounts').css('display', 'none');
    }

    // Build out the account list using the Account component
    let accounts = this.state.accounts;
    accounts = accounts.map(function(account, index) {
      return(
        <Account key = {index}
          account = {account}
          deleteAccount = {this.deleteAccount}
        />
      ); //return
    }.bind(this)); //accounts.map

    // Now that everything is set above, render the component
    return(
      <div className="application">
        <UnlockAccounts
          toggleUnlockAccounts = {this.toggleUnlockAccounts}
          unlockAccounts = {this.unlockAccounts}
        />
        <AddAccount
          toggleAddAccount = {this.toggleAddAccount}
          addAccount = {this.addAccount}
        />
        <Splash
          toggleUnlockAccounts = {this.toggleUnlockAccounts}
        />
        <Accounts
          toggleAddAccount = {this.toggleAddAccount}
          accounts = {accounts}
        />
      </div>
    ); //return
  } //render
}); //MainInterface

// Place the MainInterface component in the DOM
ReactDOM.render(
  <MainInterface />,
  document.getElementById('calendar')
); //render
