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
                className="button-change-email">ENREGISTRER
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
