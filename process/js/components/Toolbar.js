/*
 * The Toolbar Component is a sidebar for the preferences window.
 */

/*
 * Imports
 */
const React = require('react');

/*
 * React Code
 */
let Toolbar = React.createClass({
  render: function() {
    return(
      <div className="toolbar">
        <div className="toolbar-item">General</div>
        <div className="toolbar-item selected">Accounts</div>
      </div>
    );
  }
});

module.exports = Toolbar;
