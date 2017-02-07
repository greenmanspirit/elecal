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
let Account = React.createClass({
  // Pass onto the parent component that the user wants to see the AddAccount
  //   modal.
  toggleAddAccount: function () {
    this.props.toggleAddAccount();
  }, //toggleAddAccount

  // Renders the component
  render: function() {
    return(
      <div id="accounts">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <h2>Your Calendar Accounts</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <button type="button" className="btn" onClick={this.toggleAddAccount}>
                <span className="toolbar-item-button glyphicon glyphicon-plus-sign"></span>
              </button>
            </div>
          </div>
        </div>
        <ul className="accounts">{this.props.accounts}</ul>
      </div>
    ); //return
  } //render
}); //Account

module.exports = Account;
