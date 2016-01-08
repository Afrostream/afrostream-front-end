import React from 'react';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import { connect } from 'react-redux';
import config from '../../../../config';
import Login from './../OAuth/Login';
import FbLoginButton from './../OAuth/FbLoginButton';
import $ from 'jquery';

if (process.env.BROWSER) {
  require('./ModalOAuth.less');
}

class OAuth extends React.Component {

  componentWillUnmount() {
    $('.login.ui.modal').modal('hide');
  }

  onLoginModalClose() {
    // iterate over all retries, execute them and resolve the promise
    const { retriesQueue } = this.props;
    retriesQueue.forEach((retry) => {
      retry()
        .then((data) => {
          retry.resolve(data);
        })
        .catch((ex) => {
          retry.reject(ex);
        });
    });

    // clear retries and close modal
    $('.login.ui.modal').modal('hide');
  }

  openModal() {
    $('.login.ui.modal')
      .modal({
        detachable: false,
        closable: false,
        transition: 'vertical flip'
      })
      .modal('show')
    ;
  }

  render() {

    const { loginRequired } = this.props;

    if (loginRequired) {
      this.openModal();
    }

    return (
      <div className="login ui basic small modal">
        <Login modalCallback={::this.onLoginModalClose}/>
      </div>
    );
  }
}

OAuth.propTypes = {
  loginRequired: React.PropTypes.bool,
  retriesQueue: React.PropTypes.object
};

export default OAuth;
