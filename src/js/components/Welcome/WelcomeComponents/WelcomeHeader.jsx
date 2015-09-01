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

  render() {

    return (
      <section className="welcome-header">

        <div className="afrostream-statement">
          <div>Les meilleurs films et séries</div>
          <div>afro-americaines et africaines</div>
          <div>en illimité</div>
        </div>

        <div className="afrostream-statement">Les meilleurs films <br />et séries afro-américains <br />et africaine en
          ilimité
        </div>

        <button className="subscribe-button" type="button" onClick={::this.showLock}>S'ABONNER MAINTENANT</button>
      </section>
    );
  }
}

export default WelcomeHeader;
