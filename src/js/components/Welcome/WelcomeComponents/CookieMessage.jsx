import React from 'react';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';

if (process.env.BROWSER) {
  require('./CookieMessage.less');
}

class CookieMessage extends React.Component {

  state = {
    isCookieSet: null
  };

  componentDidMount() {
    let isCookieAccepted = this.isCookieAccepted();
    if (isCookieAccepted === "true") {
      this.setState({isCookieSet: "true"});
    }
  }

  isCookieAccepted() {
    let isCookieAccepted = null;

    if (canUseDOM) {
      isCookieAccepted = localStorage.getItem('afrostreamAcceptedCookies');
    }
    return isCookieAccepted;
  }

  setCookieToken() {
    if (canUseDOM) {
      localStorage.setItem('afrostreamAcceptedCookies', "true");
      this.setState({isCookieSet: "true"});
    }
  }

  render() {

    if (this.state.isCookieSet === "true") {

      return (<div />);

    } else {

      return (
        <div className="cookie-message">
          Afrostream utilise des cookies pour vous proposer des contenus et services
          adaptés à vos centres d'intérêts. <a href="/articles/cookies_policy.pdf" onClick={this.setCookieToken.bind(this)} target="_blank">En savoir plus</a>
          <button className="cookie-button" onClick={this.setCookieToken.bind(this)}>OK</button>
        </div>
      );
    }
  }
}

export default CookieMessage;
