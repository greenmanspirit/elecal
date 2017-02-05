const React = require('react');

let AddAccount = React.createClass({
  toggleAddAccount: function() {
    this.props.handleAddAccountToggle();
  },
  handleAddAccount: function(e) {
    e.preventDefault();
    values = {
      name: this.inputName.value,
      username: this.inputUsername.value,
      password: this.inputPassword.value,
      server: this.inputServer.value
    }
    this.props.handleAddAccount(values);
  },
  render: function() {
    return(
      <div className="modal fade" id="addAccount" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" aria-label="Close" onClick={this.toggleAddAccount}><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">Add Account</h4>
            </div>
            <form className="modal-body add-appointment form-horizontal" onSubmit={this.handleAddAccount}>
              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="name">Name</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control" id="name" ref={(ref) => this.inputName = ref} placeholder="Name for Account" />
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="server">Server</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control" id="server" ref={(ref) => this.inputServer = ref} placeholder="URL" />
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="username">Username</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control" id="username" ref={(ref) => this.inputUsername = ref} placeholder="Username" />
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="password">Password</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control" id="password" ref={(ref) => this.inputPassword = ref} placeholder="Password" />
                </div>
              </div>
              <div className="form-group">
                <div className="col-sm-offset-3 col-sm-9">
                  <div className="pull-right">
                    <button type="button" className="btn btn-default" onClick={this.toggleAddAccount}>Cancel</button>&nbsp;
                    <button type="submit" className="btn btn-primary">Add</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    ) //return
  } //render
}); //UnlockAccounts

module.exports = AddAccount;
