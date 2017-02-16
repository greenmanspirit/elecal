/*
 * The Accounts Component displays a list of Account Components as well as
 *   controls to manage accounts.
 */

/*
 * Imports
 */
const React = require('react');

/*
 * React Code
 */
let Accounts = React.createClass({
  // Pass onto the parent component that the user wants to see the AddAccount
  //   modal.
  toggleAddAccount: function () {
    this.props.toggleAddAccount();
  }, //toggleAddAccount

  // Renders the component
  render: function() {
    return(
      <div id="accounts" className="container-fluid">
        <div className="row">
          <div className="col-xs-12">
            <button id="addAccountBtn" type="button" className="btn" onClick={this.toggleAddAccount}>
              <span className="toolbar-item-button glyphicon glyphicon-plus-sign"></span> Add Account
            </button>
            <div className="clear"></div>
            <ul className="accounts media-list">{this.props.accounts}</ul>
          </div>
        </div>
      </div>
    ); //return
  } //render
}); //Account

module.exports = Accounts;
