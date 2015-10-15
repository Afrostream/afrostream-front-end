import React from 'react';
import { prepareRoute } from '../../decorators';
import * as UserActionCreators from '../../actions/user';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import config from '../../../../config/client';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';

if (process.env.BROWSER) {
  require('./AccountPassword.less');
}

@prepareRoute(async function ({ store }) {
  return await * [
      store.dispatch(UserActionCreators.getProfile())
    ];
})
@connect(({ User }) => ({User})) class AccountPassword extends React.Component {


  state = {passwordChanged: null};

  render() {
    const {
      props: {
        User
        }
      } = this;

    const user = User.get('user');
    console.log('*** the user id ***');

    if (user) {

      if (this.state.passwordChanged === null) {
        return (
          <div className="row-fluid">
            <div className="container">
              <div className="account-password">
                <h1>Modifier le mot de passe</h1>
                <form id="change-password" className="change-password">
                  <section id="errors-change-password">&nbsp;</section>
                    <label
                      className="new-password-label"
                      htmlFor="new-password">Nouveau mot de passe (minimum 6 caractères)</label>
                    <input
                      type="password"
                      className="new-password"
                      id="new-password"
                      name="new-password"
                      pattern=".{6,}" required title="minimum 6 caractères" />
                    <label
                      className="confirm-new-password-label"
                      htmlFor="confirm-new-password">Confirmation du mot de passe</label>
                    <input
                      type="password"
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
                      className="button-change-password">ENREGISTRER
                    </button>
                  </form>
                </div>
              </div>
            </div>
        );
      } else if (this.state.passwordChanged === true) {

          return (
          <div className="row-fluid">
            <div className="container">
              <div className="account-password">
                <h1>Modifier le mot de passe</h1>
                  <div className="password-message">Votre demande de nouveau mot de passe a bien été prise en compte.Un email de confirmation vient de vous être envoyé à {user.get('email')}.
                    Veuillez cliquer sur le lien pour valider le changement.</div>
              </div>
            </div>
          </div>
        );
      } else if (this.state.passwordChanged === false) {

        return (
          <div className="row-fluid">
            <div className="container">
              <div className="account-password">
                <h1>Modifier le mot de passe</h1>
                <div className="password-message">Une erreur est survenue durant la mise a jour, veuillez réessayer ultérieurement.</div>
              </div>
            </div>
          </div>
        );
      }
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
