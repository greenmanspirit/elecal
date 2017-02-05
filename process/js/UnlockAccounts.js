const React = require('react');

let UnlockAccounts = React.createClass({
  toggleUnlockAccounts: function() {
    this.props.handleUnlockToggle();
  },
  handleUnlock: function(e) {
    e.preventDefault();
    this.props.handleUnlock(this.inputPassword.value);
  },
  render: function() {
    return(
      <div className="modal fade" id="unlockAccounts" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-sm" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" aria-label="Close" onClick={this.toggleUnlockAccounts}><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">Unlock Your Accounts</h4>
            </div>

            <form className="modal-body add-appointment form-horizontal" onSubmit={this.handleUnlock}>
              <div className="form-group">
                <div className="col-sm-12">
                  <input type="text" className="form-control" id="password" ref={(ref) => this.inputPassword = ref} placeholder="Password" />
                </div>
              </div>
              <div className="form-group">
                <div className="col-sm-offset-3 col-sm-9">
                  <div className="pull-right">
                    <button type="button" className="btn btn-default" onClick={this.toggleUnlockAccounts}>Cancel</button>&nbsp;
                    <button type="submit" className="btn btn-primary">Unlock</button>
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

module.exports = UnlockAccounts;
