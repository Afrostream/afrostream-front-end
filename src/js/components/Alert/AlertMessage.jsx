import React from 'react';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import config from '../../../../config';
import CookieMessage from '../Welcome/WelcomeComponents/CookieMessage';

if (process.env.BROWSER) {
  require('./AlertMessage.less');
}

class AlertMessage extends React.Component {

  // do not render cookie message on server-side
  state = {
    isCookieSet: '1'
  };

  componentDidMount() {
    let isCookieAccepted = this.isCookieAccepted();

    if (isCookieAccepted !== '1') {
      this.setState({isCookieSet: '0'});
    }
  }

  isCookieAccepted() {
    let isCookieAccepted = null;

    if (canUseDOM) {
      isCookieAccepted = localStorage.getItem('afrostreamAlert');
    }
    return isCookieAccepted;
  }

  setCookieToken() {
    if (canUseDOM) {
      localStorage.setItem('afrostreamAlert', '1');
      this.setState({isCookieSet: '1'});
    }
  }

  getAlert(i, alert) {
    if (!alert || this.state.isCookieSet === '1') {
      return '';
    }
    return (
      <div className="alert-message"><span key={`alert-${i}`}>{alert}
        <button className="alert-button" onClick={::this.setCookieToken} onTouchEnd={::this.setCookieToken}>OK</button></span>
      </div>
    )
  }

  render() {

    return (
      <div className="alerts">
        {config.alerts ? config.alerts.map((alert, i) => this.getAlert(i, alert)) : ''}
        <CookieMessage />
      </div>
    );
  }
}

export default AlertMessage;
