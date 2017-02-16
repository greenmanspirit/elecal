/*
 * The AddAccount Component is a modal for adding account details.
 */

/*
 * Imports
 */
const React = require('react')

/*
 * React Code
 */
let AddAccount = React.createClass({
  // Pass onto the parent component that the user wants to hide the AddAccount
  //   modal.
  toggleAddAccount: function () {
    this.props.toggleAddAccount()
  }, // toggleAddAccount

  // Gather up the form values and pass them onto the parent component to be
  //   added as an account
  addAccount: function (e) {
    e.preventDefault()
    let values = {
      name: this.inputName.value,
      username: this.inputUsername.value,
      password: this.inputPassword.value,
      server: this.inputServer.value
    }
    this.props.addAccount(values)
  }, // addAccount

  // Renders the component
  render: function () {
    return (
      <div id='addAccount' className='container-fluid'>
        <div className='row'>
          <div className='col-xs-12'>
            <h4>Add Account</h4>
            <form className='add-appointment form-horizontal' onSubmit={this.addAccount}>
              <div className='form-group'>
                <label className='col-sm-3 control-label' htmlFor='name'>Name</label>
                <div className='col-sm-9'>
                  <input type='text' className='form-control' id='name' ref={(ref) => { this.inputName = ref }} placeholder='Name for Account' />
                </div>
              </div>
              <div className='form-group'>
                <label className='col-sm-3 control-label' htmlFor='server'>Server</label>
                <div className='col-sm-9'>
                  <input type='text' className='form-control' id='server' ref={(ref) => { this.inputServer = ref }} placeholder='Http or https url' />
                  <p id='invalidServerError' className='text-danger'>Invalid Server Url</p>
                </div>
              </div>
              <div className='form-group'>
                <label className='col-sm-3 control-label' htmlFor='username'>Username</label>
                <div className='col-sm-9'>
                  <input type='text' className='form-control' id='username' ref={(ref) => { this.inputUsername = ref }} placeholder='Username' />
                </div>
              </div>
              <div className='form-group'>
                <label className='col-sm-3 control-label' htmlFor='password'>Password</label>
                <div className='col-sm-9'>
                  <input type='password' className='form-control' id='password' ref={(ref) => { this.inputPassword = ref }} placeholder='Password' />
                </div>
              </div>
              <div className='form-group'>
                <div className='col-sm-offset-3 col-sm-9'>
                  <div className='pull-right'>
                    <button type='button' className='btn btn-default' onClick={this.toggleAddAccount}>Cancel</button>&nbsp;
                    <button type='submit' className='btn btn-primary'>Add</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    ) // return
  } // render
}) // AddAccount

module.exports = AddAccount
