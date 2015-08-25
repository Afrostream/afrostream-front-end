import React from 'react';
import { prepareRoute } from '../../decorators';
import * as UserActionCreators from '../../actions/user';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import config from '../../../../config/client';

if (process.env.BROWSER) {
  require('./AccountEmail.less');
}

@prepareRoute(async function ({ store }) {
  return await * [
      store.dispatch(UserActionCreators.getProfile())
    ];
})
@connect(({ User }) => ({User})) class AccountEmail extends React.Component {

  getInitialState() {

    return {
      cardNumber: null
    }
  };

  componentDidMount() {

    var tokenData = this.getAuthToken();
    console.log('*** token data ***');
    console.log(tokenData);
    console.log('*** end of token data ***');
  }

  getAuthToken() {

    var self = this;
    var clientData = {
      'client_id': config.auth0.client_id,
      'client_secret': 'KYmL01KW5HczO-XKpltlVUONRCXtynJQ0nFqiGNOsjN9c3RsBAnr5_T-rnnc7DYY',
      'grant_type': 'client_credentials'
    };
    var returnToken;

    clientData = JSON.stringify(clientData);

    var generateTokenUrl = 'https://' + config.auth0.domain + '/oauth/token';

    $.ajax({
      type: 'POST',
      url: generateTokenUrl,
      data: clientData,
      crossDomain: true,
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

  changeEmail(email) {

    var self = this;
    var userId = this.props.User.get('user').get('user_id');
    var auth0Path = 'https://afrostream.eu.auth0.com/api/users/' + userId + '/email';
    var emailData = {"email": email, "verify": true}

    $.ajax({
      type: 'POST',
      url: userId,
      data: emailData,
      contentType: 'application/json',
      success: function () {

        console.log('*** there was some kind of success ***');
        self.setState({
          subscriptionStatus: 'subscribed',
          message: 'You have been subscribed! Thank you.'
        });
      },
      error: function (err) {
        var errorMessage;

        console.log('**** there was an error ***');
        console.log(err);
        console.log('*** end of error message ***');

        self.setState({
          subscriptionStatus: 'not subscribed',
          message: err.responseText
        });
      }
    });

  }

  renderForm() {
    //TODO for rendering the form when we add it to this page dans une autre tâche
    return (
      <div className="row-fluid">
        <div className="container">
          <div className="account-email">
            <h1>Modifier l'adresse e-mail</h1>
            <form id="change-email" className="change-email">
              <label className="current-email-label" htmlFor="current-email">E-mail actuel:</label>
              <div className="current-email">{user.get('email')}</div>
              <label className="new-email-label" htmlFor="new-email">Nouvel e-mail</label>
              <input
                type="text"
                className="new-email"
                id="new-email"
                name="new-email"
                placeholder="" required />
              <label className="password-label" htmlFor="password">Mot de pass actuel</label>
              <input
                type="text"
                className="password"
                id="password"
                name="password"
                placeholder="" required />
              <button
                id="button-change-email"
                type="submit"
                form="change-email"
                className="button-change-email"
                onClick={this.changeEmail}>ENREGISTRER
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      props: {
        User
        }
      } = this;

    const user = User.get('user');

    if (user) {
      debugger;
      return (
        <div className="row-fluid">
          <div className="container">
            <div className="account-email">
              <h1>Modifier l'adresse e-mail</h1>
              <div className="account-email-details">
                Cette page n’est pas encore active. Pour changer votre e-mail, veuillez contacter notre
                service client a l’adresse suivante:
                <a href="mailto:support@afrostream.tv?Subject=Changer%20mail" target="_top"> support@afrostream.tv</a>
              </div>
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

export default AccountEmail;
