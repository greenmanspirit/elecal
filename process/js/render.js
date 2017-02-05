const $ = jQuery = require('jquery');
const bootstrap = require('bootstrap');
const React = require('react');
const ReactDOM = require('react-dom');

let UnlockAccounts = require('./UnlockAccounts');
let Splash = require('./Splash');

let MainInterface = React.createClass({
  getInitialState: function() {
    return {
      unlockAccountsVisible: false
    }
  }, //getInitialState

  toggleUnlockAccounts: function() {
    let temp = !this.state.unlockAccountsVisible;
    this.setState({
      unlockAccountsVisible: temp
    }); //setState
  }, //toggleUnlockDisplay

  handleUnlock: function(password) {
    this.setState({
      unlockAccountsVisible: false
    }); //setState
  }, //handleUnlock

  render: function() {
    if(this.state.unlockAccountsVisible === true) {
      $('#unlockAccounts').modal('show');
    } else {
      $('#unlockAccounts').modal('hide');
    }

    return (
      <div className="application">
        <UnlockAccounts
          handleUnlockToggle = {this.toggleUnlockAccounts}
          handleUnlock = {this.handleUnlock}
        />
        <Splash
          handleUnlockToggle = {this.toggleUnlockAccounts}
        />
      </div>
    );
  } //render
}); //MainInterface

ReactDOM.render(
  <MainInterface />,
  document.getElementById('calendar')
); //render
