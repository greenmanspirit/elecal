/*
 * This script contains the code for the Electron Renderer process. It also uses
 *   React to create the user interface and respond to interface events.
 */

/*
 * Imports
 */

const path = window.require('path');
const fs = window.require('fs');
const ipc = window.require('electron').ipcRenderer;

// Imports that work with browserify require
const $ = jQuery = require('jquery');
const _ = require('lodash');
const bootstrap = require('bootstrap');
const React = require('react');
const ReactDOM = require('react-dom');

// Import all of our React components
let UnlockAccounts = require('./components/UnlockAccounts');
let Splash = require('./components/Splash');
let Accounts = require('./components/Accounts');
let Account = require('./components/Account');
let AddAccount = require('./components/AddAccount');

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
    // There wasn't an error, so lets load the acccounts
    tmpAccounts = ipc.sendSync('loadAccounts', password);
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
  }, //unlockAccounts

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

    // Dislay/Hide Splash Component
    if(this.state.showSplash === true) {
      $('#splash').css('display', 'block');
    } else {
      $('#splash').css('display', 'none');
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
        <Splash
          toggleUnlockAccounts = {this.toggleUnlockAccounts}
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
