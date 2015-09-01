import React from 'react';
import { connect } from 'react-redux';
import * as UserActionCreators from '../../../actions/user';

if (process.env.BROWSER) {
  require('./WelcomeHeader.less');
}

@connect(({ User }) => ({User})) class WelcomeHeader extends React.Component {

  showLock() {
    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(UserActionCreators.showSignupLock());
  }

  showSigninLock() {
    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(UserActionCreators.showSigninLock());
  }

  render() {

    return (
      <section className="welcome-header">
        <img src="/images/logo.png" className="afrostream-logo" alt="Afrostream.tv" />

        <button type="button" className="login-button" onClick={::this.showSigninLock}>connexion</button>

        <div className="afrostream-statement">
          <div>Les meilleurs films et séries</div>
          <div>afro-américains et africaine</div>
          <div>en ilimité</div>
        </div>
        <button className="subscribe-button" type="button" onClick={::this.showLock}>S'ABONNER MAINTENANT</button>
      </section>
    );
  }
}

export default WelcomeHeader;
