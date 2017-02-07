/*
 * The Account Component displays the information for a single account.
 */

/*
 * Imports
 */
const React = require('react');

/*
 * React Code
 */
let Account = React.createClass({
  // Pass deletion of an account to the parent component
  deleteAccount: function() {
    this.props.deleteAccount(this.props.account);
  }, //deleteAccount

  // Renders the component
  render: function() {
    return(
      <li className="account media">
        <div className="media-left">
          <button className="account-delete btn btn-xs btn-danger" onClick={this.deleteAccount}>
          <span className="glyphicon glyphicon-remove"></span></button>
        </div>
        <div className="account-info media-body">
          <span className="account-name">{this.props.account.name}</span>
        </div>
      </li>
    ); //return
  } //render
}); //Accounts

module.exports = Account;
