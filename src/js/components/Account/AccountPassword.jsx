import React from 'react';
import { prepareRoute } from '../../decorators';
import * as UserActionCreators from '../../actions/user';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import config from '../../../../config/client';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';

if (canUseDOM) {
  require('jquery');
  require('bootstrap');
}

if (process.env.BROWSER) {
  require('./AccountPassword.less');
}

@prepareRoute(async function ({ store }) {
  return await * [
      store.dispatch(UserActionCreators.getProfile())
    ];
})
@connect(({ User }) => ({User})) class AccountPassword extends React.Component {

  getInitialState() {

    return {
      cardNumber: null
    }
  };

  componentDidMount() {

  }

  changePassword() {
    debugger;
    $( "#change-password" ).submit(function(event) {
      event.preventDefault();
    });

    var self = this;
    var userId = $('#user-id').val();
    var auth0Path = 'https://afrostream.eu.auth0.com/api/users/' + userId + '/password';
    var token = getAuthToken();
    var emailData = {'password': 's0mepass', 'verify': true};
    var authHeader = 'Bearer ' + token.access_token;
    console.log('auth header');

    emailData = JSON.stringify(emailData);

    $.ajax({
      type: 'PUT',
      url: auth0Path,
      data: emailData,
      contentType: 'application/json',
      headers: {
        'Authorization': authHeader
      },
      success: function (responseData) {

        console.log('*** there was some kind of success ***');
        console.log(responseData);
      },
      error: function (err) {

        console.log('**** there was an error ***');
        console.log(err);
        console.log('*** end of error message ***');
      }
    });

    function getAuthToken() {

      var clientData = {
        'client_id': 'BtSdIqKqfIse0H1dqlpHFJgKIkUG0NpE',
        'client_secret': 'KYmL01KW5HczO-XKpltlVUONRCXtynJQ0nFqiGNOsjN9c3RsBAnr5_T-rnnc7DYY',
        'grant_type': 'client_credentials'
      };
      var returnToken;

      clientData = JSON.stringify(clientData);

      $.ajax({
        type: 'POST',
        url: 'https://afrostream.eu.auth0.com/oauth/token',
        data: clientData,
        crossDomain: true,
        async: false,
        contentType: 'application/json',
        success: function (responseData) {

          console.log('*** there was some kind of success in getAuthToken ***');
          returnToken = responseData;

        },
        error: function (err) {

          console.log('**** there was an error ***');
          console.log(err);
          console.log('*** end of error message ***');
          returnToken = err;
        }
      });

      return returnToken;
    }

  }

  render() {
    const {
      props: {
        User
        }
      } = this;

    const user = User.get('user');
    console.log('*** the user id ***');
    console.log(user.get('user_id'));

    if (user) {

      return (
        <div className="row-fluid">
          <div className="container">
            <div className="account-password">
              <h1>Modifier le mot de passe</h1>
              <form id="change-password" className="change-password">
                <label
                  className="new-password-label"
                  htmlFor="new-password">Nouveau mot de passe (minimum 6 caractères)</label>
                <input
                  type="text"
                  className="new-password"
                  id="new-password"
                  name="new-password"
                  pattern=".{6,}" required title="minimum 6 caractères" />
                <label
                  className="confirm-new-password-label"
                  htmlFor="confirm-new-password">Nouveau mot de passe (minimum 6 caractères)</label>
                <input
                  type="text"
                  className="confirm-new-password"
                  id="confirm-new-password"
                  name="confirm-new-password"
                  pattern=".{6,}" required title="minimum 6 caractères" />
                <input
                  type="hidden"
                  id="user-id"
                  name="user-id"
                  value = {user.get('user_id')} />
                <button
                  id="button-change-password"
                  type="submit"
                  form="change-password"
                  className="button-change-password"
                  onClick={this.changePassword}>ENREGISTRER
              </button>
              </form>
            </div>
          </div>
      </div>
      );
    } else {

      return (
        <div className="row-fluid">
          no user found
        </div>
      );
    }
  }
}

export default AccountPassword;
