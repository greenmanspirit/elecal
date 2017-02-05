const React = require('react');

let Account = React.createClass({
  handleDelete: function() {
    this.props.handleDeleteAccount(this.props.whichAccount);
  },
  render: function() {
    return(
      <li className="account media">
        <div className="media-left">
          <button className="account-delete btn btn-xs btn-danger" onClick={this.handleDelete}>
          <span className="glyphicon glyphicon-remove"></span></button>
        </div>
        <div className="account-info media-body">
          <span className="account-name">{this.props.singleAccount.name}</span>
        </div>
      </li>
    )
}
}); //Accounts

module.exports = Account;
