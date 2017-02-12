/*
 * The UnlockAccounts Component is a modal for unlocking (getting the password
 *   to be able to decypt the users account config file) the accounts.
 */

/*
 * Imports
 */
const React = require('react');

/*
 * React Code
 */
let UnlockAccounts = React.createClass({
  // Pass onto the parent component that the user wants to hide the
  //   UnlockAccount modal.
  toggleUnlockAccounts: function() {
    this.props.toggleUnlockAccounts();
  }, //toggleUnlockAccounts

  // Gather the passord from the form and pass it to the parent component to
  //   unlock the acccounts.
  unlockAccounts: function(e) {
    e.preventDefault();
    this.props.unlockAccounts(this.inputPassword.value);
  }, //unlockAccounts

  // Renders the component
  render: function() {
    return(
      <div className="modal fade" id="unlockAccounts" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-sm" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" aria-label="Close" onClick={this.toggleUnlockAccounts}><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">Unlock Your Accounts</h4>
            </div>

            <form className="modal-body add-appointment form-horizontal" onSubmit={this.unlockAccounts}>
              <div className="form-group">
                <div className="col-sm-12">
                  <p id="unlockError" className="text-danger">Incorrect Password</p>
                  <input type="password" className="form-control" id="password" ref={(ref) => this.inputPassword = ref} placeholder="Password" />
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
