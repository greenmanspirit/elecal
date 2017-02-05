const React = require('react');

let UnlockAccounts = React.createClass({
    toggleUnlockAccounts: function() {
      this.props.handleUnlockToggle();
    },
    render: function() {
      return(
        <div id="splash" className="container">
        <div className="row splash">
          <div className="col-sm-6 col-sm-offset-3 vcenter">
            <h1>Elecal</h1>
            <p>In order to keep your remote calendar login information secure, you must enter a password to use Elecal.</p>
            <button type="button" className="btn btn-primary" onClick={this.toggleUnlockAccounts}>Unlock</button>
          </div>
        </div>
        </div>
      );
    }
});

module.exports = UnlockAccounts;
