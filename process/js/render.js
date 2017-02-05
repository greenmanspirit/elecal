const $ = jQuery = require('jquery');
const _ = require('lodash');
const bootstrap = require('bootstrap');
const path = window.require('path');
const fs = window.require('fs');
const ipcRenderer = window.require('electron').ipcRenderer;
const crypto = window.require('crypto');
const React = require('react');
const ReactDOM = require('react-dom');

let UnlockAccounts = require('./components/UnlockAccounts');
let Splash = require('./components/Splash');
let Accounts = require('./components/Accounts');
let AddAccount = require('./components/AddAccount');

let config_path = ipcRenderer.sendSync('getConfigDir');
let account_config = path.join(config_path, 'accounts');
function loadAccounts(password) {
  let encrypted_accounts = fs.readFileSync(account_config, {encoding: 'utf8'});
  let decipher = crypto.createDecipher('aes-256-ctr', password)
  let accounts = decipher.update(encrypted_accounts, 'base64', 'utf8')
  accounts += decipher.final('utf8');
  return JSON.parse(accounts);
}
function saveAccounts(password, accounts) {
  let cipher = crypto.createCipher('aes-256-ctr', password);
  let encrypted_accounts = cipher.update(JSON.stringify(accounts), 'utf8', 'base64');
  encrypted_accounts += cipher.final('base64');
  fs.writeFileSync(account_config, encrypted_accounts, {encoding: 'utf8'});
}

let MainInterface = React.createClass({
  getInitialState: function() {
    return {
      password: '',
      accounts: [],
      unlockAccountsVisible: false,
      addAccountVisible: false,
      showSplash: true
    }
  }, //getInitialState

  toggleUnlockAccounts: function() {
    let temp = !this.state.unlockAccountsVisible;
    this.setState({
      unlockAccountsVisible: temp
    }); //setState
  }, //toggleUnlockDisplay

  toggleAddAccount: function() {
    let temp = !this.state.addAccountVisible;
    this.setState({
      addAccountVisible: temp
    }); //setState
  }, //toggleUnlockDisplay

  handleUnlock: function(password) {
    // Config file creation if needed
    fs.access(account_config, fs.constants.R_OK | fs.constants.W_OK, function(err) {
      let tmpAccounts = this.state.accounts;
      if(err) {
        let cipher = crypto.createCipher('aes-256-ctr', password);
        let crypted = cipher.update(JSON.stringify(tmpAccounts), 'utf8', 'base64');
        crypted += cipher.final('base64');
        fs.open(account_config, 'w', 0o600, function(err, fd) {
          fs.writeSync(fd, crypted);
          fs.close(fd);
        });
      } else {
        tmpAccounts = loadAccounts(password);
      }
      this.setState({
        accounts: tmpAccounts,
        password: password,
        unlockAccountsVisible: false,
        showSplash: false
      }); //setState
    }.bind(this));
  }, //handleUnlock

  handleAddAccount: function(values) {
      let tmpAccounts = this.state.accounts;
      tmpAccounts.push(values);
      this.setState({
        accounts: tmpAccounts,
        addAccountVisible: false
      }); //setState
      saveAccounts(this.state.password, tmpAccounts);
  }, //handleAddAccount

  handleDeleteAccount: function(account) {
    let tmpAccounts = this.state.accounts;
    tmpAccounts = _.without(tmpAccounts, account);
    this.setState({
      accounts: tmpAccounts
    }); //setState
    saveAccounts(this.state.password, tmpAccounts);
  },

  render: function() {
    console.log(this.state);

    if(this.state.unlockAccountsVisible === true) {
      $('#unlockAccounts').modal('show');
    } else {
      $('#unlockAccounts').modal('hide');
    }

    if(this.state.addAccountVisible === true) {
      $('#addAccount').modal('show');
    } else {
      $('#addAccount').modal('hide');
    }

    if(this.state.showSplash === true) {
      $('#splash').css('display', 'block');
    } else {
      $('#splash').css('display', 'none');
    }

    let accounts = this.state.accounts;
    accounts = accounts.map(function(account, index) {
      return(
      <Accounts key={index}
        singleAccount = {account}
        whichAccount = {account}
        handleDeleteAccount = {this.handleDeleteAccount}
      />);
    }.bind(this));

    return (
      <div className="application">
        <UnlockAccounts
          handleUnlockToggle = {this.toggleUnlockAccounts}
          handleUnlock = {this.handleUnlock}
        />
        <AddAccount
          handleAddAccountToggle = {this.toggleAddAccount}
          handleAddAccount = {this.handleAddAccount}
        />
        <Splash
          handleUnlockToggle = {this.toggleUnlockAccounts}
        />
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <button type="button" className="btn" onClick={this.toggleAddAccount}>Add Account</button>
            </div>
          </div>
        </div>
        <ul className="accounts">{accounts}</ul>
      </div>
    );
  } //render
}); //MainInterface

ReactDOM.render(
  <MainInterface />,
  document.getElementById('calendar')
); //render
