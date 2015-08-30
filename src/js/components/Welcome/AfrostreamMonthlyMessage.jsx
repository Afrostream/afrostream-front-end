import React from 'react';
import { connect } from 'react-redux';
import * as UserActionCreators from '../../actions/user';
if (process.env.BROWSER) {
  require('./AfrostreamMonthlyMessage.less');
}

@connect(({ User }) => ({User})) class AfrostreamMonthlyMessage extends React.Component {

  logout() {
    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(UserActionCreators.logOut());
  }


  render() {
    const {
      props: {
        User
        }
      } = this;

    return (
      <section className="afrostream-monthly-message">
        <div className="header">
          <img className="create-account-logo" src="/images/logo.png"/>
        </div>
        <div className="message-container">
          <h3>Merci d'avoir réservé la formule THINK LIKE A MAN. </h3>

          <p>Rendez vous le 1er octobre pour profiter de votre abonnement.</p>
          <button
            className="logout-button"
            onClick={::this.logOut}>se déconnecter
          </button>
        </div>
      </section>
    );
  }
}

export default AfrostreamMonthlyMessage;
