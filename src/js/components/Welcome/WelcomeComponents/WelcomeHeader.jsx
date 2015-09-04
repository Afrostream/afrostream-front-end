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

    let posterImg = 'https://afrostream.imgix.net/production/poster/2015/08/ab69b5337b8a05d4c896-last-letter%202560x1440.jpg';
    let imageStyle = {backgroundImage: `url(${posterImg}?crop=faces&fit=clip&w=1920&h=815&q=65)`};


    return (
      <section className="welcome-header" style={imageStyle}>

        <div className="afrostream-statement">
          <div>Les meilleurs films et séries</div>
          <div>afro-américains et africains</div>
          <div>en illimité</div>
        </div>

        <button className="subscribe-button" type="button" onClick={::this.showLock}>S'ABONNER MAINTENANT</button>
      </section>
    );
  }
}

export default WelcomeHeader;
