/*
 * The Splash Component displays when the app is first opened and explains to
 *   the user that the app uses a password and give them the unlock button.
 */

/*
 * Imports
 */
const React = require('react');

/*
 * React Code
 */
let UnlockAccounts = React.createClass({
  // Pass onto the parent component that the user wants to see the UnlockAccount
  //   modal.
  toggleUnlockAccounts: function() {
    this.props.toggleUnlockAccounts();
  }, //toggleUnlockAccounts

  // Renders the component
  render: function() {
    return(
      <div id="splash" className="container">
      <div className="row splash">
        <div className="col-sm-6 col-sm-offset-3 vcenter">
          <h1>Elecal</h1>
          <p>In order to keep your remote calendar login information secure, you must enter a password to use Elecal.</p>
          <button type="button" className="btn btn-primary" onClick={this.toggleUnlockAccounts} autoFocus>Unlock</button>
        </div>
      </div>
      </div>
    ); // return
  } // render
}); // UnlockAccounts

module.exports = UnlockAccounts;
