const $ = jQuery = require('jquery');
const bootstrap = require('bootstrap');
const React = require('react');
const ReactDOM = require('react-dom');

var MainInterface = React.createClass({
  render: () => {
    return (
      <h1>Elecal App</h1>
    );
  } //render
}); //MainInterface

ReactDOM.render(
  <MainInterface />,
  document.getElementById('calendar')
); //render
