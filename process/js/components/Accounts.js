const React = require('react');

let Account = React.createClass({
  toggleAddAccount: function () {
    this.props.handleAddAccountToggle();
  },
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
    )
}
}); //Accounts

module.exports = Account;
